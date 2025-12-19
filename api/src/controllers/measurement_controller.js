const Measurement = require("../models/measurement");
const PatientProfile = require("../models/patient_profile");
const DiseaseStats = require("../models/disease_stats");
const User = require("../models/user");
// add measurement
const createMeasurement = async (req, res) => {
    try {
        const {
            userId,
            type,
            value,
            unit,
            symptoms
        } = req.body;

        const currentUser = req.user;


        if (!userId || !type || !value) {
            return res.status(400).json({
                success: false,
                message: "Hasta ID, ölçüm tipi ve değer zorunludur"
            });
        }

        // Hasta var mı kontrol et
        const patient = await User.findOne({
            _id: userId,
            role: "patient",
            isActive: true
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Hasta bulunamadı"
            });
        }

        if (currentUser.role === "patient" && currentUser.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "Başka bir hastanın ölçümünü giremezsiniz"
            });
        }

        // Ölçüm oluştur
        const measurement = new Measurement({
            userId,
            doctorId: currentUser.role === "doctor" ? currentUser.userId : undefined,
            enteredBy: currentUser.role,
            type,
            value,
            unit: unit || undefined,
            symptoms: symptoms || []
        });

        await measurement.save();

        await measurement.populate('doctorId', 'email');
        await measurement.populate('userId', 'email');

        res.status(201).json({
            success: true,
            message: "Ölçüm başarıyla kaydedildi",
            data: measurement
        });

    } catch (error) {
        logger.error("Ölçüm oluşturma hatası:", error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Geçersiz veri formatı",
                errors: Object.values(error.errors).map(e => e.message)
            });
        }

        res.status(500).json({
            success: false,
            message: "Ölçüm kaydedilirken bir hata oluştu",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const getLastMeasurements = async (req, res) => {
    try {
        const userId = req.user._id;

        // Son 30 günün ölçümlerini al
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const measurements = await Measurement.find({ 
            userId,
            createdAt: { $gte: thirtyDaysAgo }
        })
            .sort({ createdAt: -1 })
            .limit(200);

        // Tip bazında ölçümleri filtrele ve formatla
        const formatted = measurements.map(m => {
            // type'a göre değerleri map et
            let glucose = null;
            let heartRate = null;
            
            if (m.type === 'blood_sugar' || m.type === 'glucose' || m.type === 'şeker') {
                glucose = typeof m.value === 'number' ? m.value : parseFloat(m.value) || null;
            }
            if (m.type === 'heart_rate' || m.type === 'nabız' || m.type === 'pulse') {
                heartRate = typeof m.value === 'number' ? m.value : parseFloat(m.value) || null;
            }

            return {
                glucose,
                heartRate,
                type: m.type,
                value: m.value,
                unit: m.unit,
                createdAt: m.createdAt,
            };
        });

        // Aylık istatistikler (son 12 ay)
        const monthlyStats = [];
        const now = new Date();
        for (let i = 0; i < 12; i++) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
            
            const monthCount = measurements.filter(m => 
                m.createdAt >= monthStart && m.createdAt <= monthEnd
            ).length;
            
            monthlyStats.unshift({
                name: monthStart.toLocaleDateString('tr-TR', { month: 'short' }),
                value: monthCount,
            });
        }

        res.json({
            success: true,
            data: formatted,
            monthlyStats,
        });

    } catch (err) {
        console.error("getLastMeasurements", err);
        res.status(500).json({ success: false, message: "Ölçümler alınamadı" });
    }
};

const getUserMeasurement = async (req, res) => {
    try {
        const userId  = req.user._id;

        if(!req.user) return res.status(401).json({success:false, message:"Unauthorized"});
        if(req.user.role === "patient" && req.user._id.toString() !== userId) return res.status(403).json({success:false, message:"Forbidden"});

        const list = await Measurement.find({userId})
            .populate('doctorId', 'fullName email')
            .sort({createdAt: -1})
            .limit(1000);
        return res.status(200).json({success:true, data:list});
    }catch (e){
        res.status(500).json({success:false, message:`Error: ${e}`});
    }
}


const updateMeasurement = async (req, res) => {
    try {
        const { measurementId } = req.params;
        const { type, value, unit, symptoms } = req.body;
        const currentUser = req.user;

        const measurement = await Measurement.findById(measurementId);

        if (!measurement) {
            return res.status(404).json({
                success: false,
                message: "Ölçüm bulunamadı"
            });
        }

        // Sadece oluşturan kişi güncelleyebilir
        const canUpdate =
            (currentUser.role === "doctor" && measurement.doctorId?.toString() === currentUser.userId) ||
            (currentUser.role === "patient" && measurement.userId.toString() === currentUser.userId && measurement.enteredBy === "patient");

        if (!canUpdate) {
            return res.status(403).json({
                success: false,
                message: "Bu ölçümü güncelleme yetkiniz yok"
            });
        }

        // Güncelle
        if (type !== undefined) measurement.type = type;
        if (value !== undefined) measurement.value = value;
        if (unit !== undefined) measurement.unit = unit;
        if (symptoms !== undefined) measurement.symptoms = symptoms;

        await measurement.save();

        res.status(200).json({
            success: true,
            message: "Ölçüm başarıyla güncellendi",
            data: measurement
        });

    } catch (error) {
        logger.error("Ölçüm güncelleme hatası:", error);
        res.status(500).json({
            success: false,
            message: "Ölçüm güncellenirken bir hata oluştu",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


const deleteMeasurement = async (req, res) => {
    try {
        const { measurementId } = req.params;
        const currentUser = req.user;

        const measurement = await Measurement.findById(measurementId);

        if (!measurement) {
            return res.status(404).json({
                success: false,
                message: "Ölçüm bulunamadı"
            });
        }

        // Sadece oluşturan kişi silebilir
        const canDelete =
            (currentUser.role === "doctor" && measurement.doctorId?.toString() === currentUser.userId) ||
            (currentUser.role === "patient" && measurement.userId.toString() === currentUser.userId && measurement.enteredBy === "patient");

        if (!canDelete) {
            return res.status(403).json({
                success: false,
                message: "Bu ölçümü silme yetkiniz yok"
            });
        }

        await Measurement.findByIdAndDelete(measurementId);

        res.status(200).json({
            success: true,
            message: "Ölçüm başarıyla silindi"
        });

    } catch (error) {
        logger.error("Ölçüm silme hatası:", error);
        res.status(500).json({
            success: false,
            message: "Ölçüm silinirken bir hata oluştu",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
module.exports = {createMeasurement, getUserMeasurement,getLastMeasurements,deleteMeasurement};