import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// MUI Joy
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Alert from '@mui/joy/Alert';
import Checkbox from '@mui/joy/Checkbox';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PinDropIcon from '@mui/icons-material/PinDrop';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import StoreIcon from '@mui/icons-material/Store';

/* ── View-mode info row ── */
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-blue-500">{icon}</span>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5"
          style={{ fontFamily: "'Sora', sans-serif" }}>
          {label}
        </p>
        <p className="text-sm font-medium text-slate-700"
          style={{ fontFamily: "'Sora', sans-serif" }}>
          {value || <span className="text-slate-300 italic font-normal">Not set</span>}
        </p>
      </div>
    </div>
  );
}

/* ── Editable field ── */
function EditField({ label, name, value, onChange, type = 'text', icon, placeholder }) {
  return (
    <FormControl>
      <FormLabel sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
        {label}
      </FormLabel>
      <Input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        startDecorator={icon}
        sx={{
          borderRadius: '10px',
          '--Input-focusedThickness': '2px',
          fontSize: '0.875rem',
        }}
      />
    </FormControl>
  );
}

/* ── Section wrapper ── */
function ProfileSection({ icon, title, children, accent = false }) {
  return (
    <div className={`rounded-2xl border overflow-hidden ${
      accent ? 'border-blue-100' : 'border-slate-100'
    }`}>
      <div className={`flex items-center gap-3 px-5 py-3 ${
        accent
          ? 'bg-gradient-to-r from-blue-600 to-blue-800'
          : 'bg-slate-50 border-b border-slate-100'
      }`}>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
          accent ? 'bg-white/20' : 'bg-blue-50'
        }`}>
          <span className={accent ? 'text-white' : 'text-blue-500'}>{icon}</span>
        </div>
        <span className={`text-sm font-semibold ${accent ? 'text-white' : 'text-slate-700'}`}
          style={{ fontFamily: "'Sora', sans-serif" }}>
          {title}
        </span>
      </div>
      <div className="px-5 py-4 bg-white">
        {children}
      </div>
    </div>
  );
}

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
function Profile() {
  const { user, profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing]       = useState(false);
  const [isFoodSource, setIsFoodSource] = useState(false);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', location: '', pincode: '',
    foodSource: { sourceType: '', sourceName: '', sourceLocation: '', pincode: '' },
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name:     profile.name     || '',
        email:    profile.email    || '',
        phone:    profile.phone    || '',
        location: profile.location || '',
        pincode:  profile.pincode  || '',
        foodSource: profile.foodSource || { sourceType: '', sourceName: '', sourceLocation: '', pincode: '' },
      });
      setIsFoodSource(!!profile.foodSource);
      setLoading(false);
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('foodSource.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, foodSource: { ...prev.foodSource, [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const updateData = { ...formData, foodSource: isFoodSource ? formData.foodSource : null };
      const response = await updateProfile(updateData);
      if (response.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  /* ── Avatar initials ── */
  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
          <p className="text-sm text-slate-400 animate-pulse"
            style={{ fontFamily: "'Sora', sans-serif" }}>
            Loading profile…
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Sora:wght@300;400;500;600&display=swap');
      `}</style>

      <div className="relative min-h-screen bg-slate-50 py-12 px-4 md:px-8 overflow-hidden">

        {/* Blobs */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-blue-100/50 blur-[110px]" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-blue-50/60 blur-[90px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-2xl mx-auto flex flex-col gap-6"
        >

          {/* ── Profile hero card ── */}
          <div className="rounded-3xl shadow-lg border border-blue-100 overflow-visible relative">
            {/* Banner */}
            <div
              className="h-28 relative rounded-t-3xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
            </div>

            {/* Avatar + name row */}
            <div className="bg-white px-6 pb-6 pt-12 rounded-b-3xl">
              {/* Avatar - absolutely positioned to straddle the banner */}
              <div
                className="absolute left-6 w-20 h-20 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-2xl font-black text-white z-10"
                style={{ top: 'calc(7rem - 2.5rem)', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', fontFamily: "'Playfair Display', serif" }}
              >
                {initials}
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-20" />{/* spacer for avatar */}

                {/* Action button */}
                {!isEditing ? (
                  <Button
                    size="sm"
                    startDecorator={<EditIcon sx={{ fontSize: 15 }} />}
                    onClick={() => { setIsEditing(true); setSuccess(''); setError(''); }}
                    sx={{
                      borderRadius: '100px', fontWeight: 600, px: 2.5,
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      boxShadow: '0 3px 14px rgba(37,99,235,0.28)',
                      '&:hover': { filter: 'brightness(1.08)', transform: 'translateY(-1px)' },
                      transition: 'all 0.18s',
                      fontFamily: "'Sora', sans-serif",
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Chip variant="soft" color="primary" size="sm"
                    sx={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Editing
                  </Chip>
                )}
              </div>  {/* end flex justify-between */}

              <h2
                className="text-2xl font-black text-slate-800 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {profile?.name || 'Your Name'}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5"
                style={{ fontFamily: "'Sora', sans-serif" }}>
                {profile?.email}
                {profile?.foodSource && (
                  <span className="ml-2 inline-flex items-center gap-1 text-blue-500 font-medium">
                    · <RestaurantIcon sx={{ fontSize: 13 }} /> Food Source
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* ── Alerts ── */}
          <AnimatePresence>
            {(error || success) && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <Alert
                  color={error ? 'danger' : 'success'}
                  startDecorator={error ? <ErrorIcon /> : <CheckCircleIcon />}
                  endDecorator={
                    <button onClick={() => { setError(''); setSuccess(''); }}
                      className="opacity-60 hover:opacity-100 transition-opacity">
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </button>
                  }
                  sx={{ borderRadius: '12px', fontSize: '0.85rem' }}
                >
                  {error || success}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ════════════════════════
              VIEW MODE
          ════════════════════════ */}
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4"
              >
                <ProfileSection icon={<PersonIcon sx={{ fontSize: 15 }} />} title="Personal Information">
                  <InfoRow icon={<PersonIcon sx={{ fontSize: 15 }} />}      label="Full Name"  value={profile?.name} />
                  <InfoRow icon={<EmailIcon sx={{ fontSize: 15 }} />}       label="Email"      value={profile?.email} />
                  <InfoRow icon={<PhoneIcon sx={{ fontSize: 15 }} />}       label="Phone"      value={profile?.phone} />
                  <InfoRow icon={<LocationOnIcon sx={{ fontSize: 15 }} />}  label="Location"   value={profile?.location} />
                  <InfoRow icon={<PinDropIcon sx={{ fontSize: 15 }} />}     label="Pincode"    value={profile?.pincode} />
                </ProfileSection>

                {profile?.foodSource && (
                  <ProfileSection
                    icon={<RestaurantIcon sx={{ fontSize: 15 }} />}
                    title="Food Source Information"
                    accent
                  >
                    <InfoRow icon={<StoreIcon sx={{ fontSize: 15 }} />}       label="Source Name"     value={profile.foodSource.sourceName} />
                    <InfoRow icon={<RestaurantIcon sx={{ fontSize: 15 }} />}  label="Source Type"     value={profile.foodSource.sourceType} />
                    <InfoRow icon={<LocationOnIcon sx={{ fontSize: 15 }} />}  label="Source Location" value={profile.foodSource.sourceLocation} />
                    <InfoRow icon={<PinDropIcon sx={{ fontSize: 15 }} />}     label="Source Pincode"  value={profile.foodSource.pincode} />
                  </ProfileSection>
                )}
              </motion.div>

            ) : (

              /* ════════════════════════
                  EDIT MODE
              ════════════════════════ */
              <motion.div
                key="edit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                  {/* Personal info section */}
                  <ProfileSection icon={<PersonIcon sx={{ fontSize: 15 }} />} title="Personal Information">
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <EditField label="Full Name"  name="name"     value={formData.name}     onChange={handleChange} placeholder="Ramesh Patil"
                          icon={<PersonIcon sx={{ fontSize: 15, color: '#94a3b8' }} />} />
                        <EditField label="Email"      name="email"    value={formData.email}    onChange={handleChange} type="email" placeholder="you@example.com"
                          icon={<EmailIcon sx={{ fontSize: 15, color: '#94a3b8' }} />} />
                        <EditField label="Phone"      name="phone"    value={formData.phone}    onChange={handleChange} placeholder="9876543210"
                          icon={<PhoneIcon sx={{ fontSize: 15, color: '#94a3b8' }} />} />
                        <EditField label="Pincode"    name="pincode"  value={formData.pincode}  onChange={handleChange} placeholder="416115"
                          icon={<PinDropIcon sx={{ fontSize: 15, color: '#94a3b8' }} />} />
                      </div>
                      <EditField label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="City, State"
                        icon={<LocationOnIcon sx={{ fontSize: 15, color: '#94a3b8' }} />} />
                    </div>
                  </ProfileSection>

                  {/* Food source toggle */}
                  <div className="bg-white rounded-2xl border border-slate-100 px-5 py-4">
                    <Checkbox
                      checked={isFoodSource}
                      onChange={(e) => setIsFoodSource(e.target.checked)}
                      label={
                        <span className="text-sm font-semibold text-slate-700"
                          style={{ fontFamily: "'Sora', sans-serif" }}>
                          I am a Food Source{' '}
                          <span className="text-slate-400 font-normal">(restaurant, canteen, event, etc.)</span>
                        </span>
                      }
                      sx={{ '--Checkbox-size': '18px' }}
                    />
                  </div>

                  {/* Food source fields */}
                  <AnimatePresence>
                    {isFoodSource && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <ProfileSection
                          icon={<RestaurantIcon sx={{ fontSize: 15 }} />}
                          title="Food Source Information"
                          accent
                        >
                          <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <EditField label="Source Name"     name="foodSource.sourceName"     value={formData.foodSource.sourceName}     onChange={handleChange} placeholder="e.g. Rajdhani Hotel"
                                icon={<StoreIcon sx={{ fontSize: 15, color: '#94a3b8' }} />} />
                              <EditField label="Source Type"     name="foodSource.sourceType"     value={formData.foodSource.sourceType}     onChange={handleChange} placeholder="e.g. Restaurant"
                                icon={<RestaurantIcon sx={{ fontSize: 15, color: '#94a3b8' }} />} />
                              <EditField label="Source Location" name="foodSource.sourceLocation" value={formData.foodSource.sourceLocation} onChange={handleChange} placeholder="Street, Area"
                                icon={<LocationOnIcon sx={{ fontSize: 15, color: '#94a3b8' }} />} />
                              <EditField label="Source Pincode"  name="foodSource.pincode"        value={formData.foodSource.pincode}        onChange={handleChange} placeholder="416115"
                                icon={<PinDropIcon sx={{ fontSize: 15, color: '#94a3b8' }} />} />
                            </div>
                          </div>
                        </ProfileSection>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action row */}
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="plain" color="neutral"
                      onClick={() => { setIsEditing(false); setError(''); setSuccess(''); }}
                      startDecorator={<CloseIcon sx={{ fontSize: 16 }} />}
                      sx={{ borderRadius: '100px', fontFamily: "'Sora', sans-serif" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={saving}
                      startDecorator={!saving && <SaveIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        borderRadius: '100px', fontWeight: 700, px: 3,
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        boxShadow: '0 4px 16px rgba(37,99,235,0.30)',
                        '&:hover': { filter: 'brightness(1.08)', transform: 'translateY(-1px)', boxShadow: '0 8px 24px rgba(37,99,235,0.40)' },
                        transition: 'all 0.18s',
                        fontFamily: "'Sora', sans-serif",
                      }}
                    >
                      {saving ? 'Saving…' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </>
  );
}

export default Profile;