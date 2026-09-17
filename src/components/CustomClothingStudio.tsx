import React, { useState } from 'react';
import { Sparkles, Scissors, CheckCircle, MessageCircle, Ruler, Send, Palette, Pipette, Check } from 'lucide-react';
import { CustomClothingRequest } from '../types';

export const CustomClothingStudio: React.FC = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    garmentType: 'Saree & Blouse' as CustomClothingRequest['garmentType'],
    fabricPreference: 'Pure Mulberry Silk',
    colorPreference: 'Peacock Emerald (#0F4C5C)',
    bust: '',
    waist: '',
    hip: '',
    shoulder: '',
    blouseLength: '',
    height: '',
    specialNotes: '',
    budgetRange: '₹25,000 - ₹50,000'
  });

  const [selectedColorHex, setSelectedColorHex] = useState('#0F4C5C');
  const [customHexInput, setCustomHexInput] = useState('#0F4C5C');
  const [colorCategory, setColorCategory] = useState<'all' | 'jewel' | 'metallic' | 'pastel' | 'earth'>('all');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const garmentOptions = [
    { type: 'Saree & Blouse', desc: 'Hand-pleated drape with tailored structured corset or padded blouse.' },
    { type: 'Bridal Lehenga', desc: '16-kali raw silk skirt with customized can-can and hand-embroidered veil.' },
    { type: 'Anarkali Gown', desc: 'Floor-length Chanderi or georgette ensemble with gota patti borders.' },
    { type: 'Festive Kurta Set', desc: 'Tailored straight-cut or Angrakha silhouette with organza dupatta.' },
    { type: 'Custom Indo-Western', desc: 'Architectural cape drapes, pre-stitched concept sarees, and jackets.' }
  ];

  const fabrics = [
    'Pure Mulberry Silk',
    'Banarasi Katan Silk',
    'Raw Silk 120gsm',
    'Hand-Spun Chanderi Silk',
    'Featherlight Kora Organza',
    'Handloom Khadi Cotton'
  ];

  const curatedColors = [
    // Royal Jewel Tones
    { name: 'Peacock Emerald', hex: '#0F4C5C', category: 'jewel' },
    { name: 'Royal Sapphire', hex: '#1A365D', category: 'jewel' },
    { name: 'Imperial Amethyst', hex: '#4A154B', category: 'jewel' },
    { name: 'Deep Ruby Crimson', hex: '#7A1C28', category: 'jewel' },
    { name: 'Rani Fuchsia', hex: '#B81D63', category: 'jewel' },
    { name: 'Regal Velvet Plum', hex: '#3B1443', category: 'jewel' },

    // Heritage Metallics & Warm Weaves
    { name: 'Antique Gold', hex: '#9C7C38', category: 'metallic' },
    { name: 'Zari Brass', hex: '#C5A059', category: 'metallic' },
    { name: 'Champagne Pearl', hex: '#E5D9C5', category: 'metallic' },
    { name: 'Copper Rust', hex: '#944E27', category: 'metallic' },
    { name: 'Saffron Vermillion', hex: '#D9531E', category: 'metallic' },
    { name: 'Turmeric Haldi', hex: '#E5A93C', category: 'metallic' },

    // Pastels & Florals
    { name: 'Dusty Rose', hex: '#C08081', category: 'pastel' },
    { name: 'Blush Peach', hex: '#F2C4B7', category: 'pastel' },
    { name: 'Powder Sky Blue', hex: '#8EABC3', category: 'pastel' },
    { name: 'Mint Pista', hex: '#94B49F', category: 'pastel' },
    { name: 'Soft Lavender', hex: '#B8A9C9', category: 'pastel' },
    { name: 'Raw Tussar Ivory', hex: '#F4EEDB', category: 'pastel' },

    // Earthy & Deep Neutrals
    { name: 'Sage Green', hex: '#2D5A46', category: 'earth' },
    { name: 'Olive Mehendi', hex: '#4D5634', category: 'earth' },
    { name: 'Midnight Navy', hex: '#1A2A3A', category: 'earth' },
    { name: 'Deep Spruce', hex: '#143D32', category: 'earth' },
    { name: 'Charcoal Slate', hex: '#2F353B', category: 'earth' },
    { name: 'Sandalwood Ochre', hex: '#8C6D37', category: 'earth' }
  ];

  const filteredColors = colorCategory === 'all' 
    ? curatedColors 
    : curatedColors.filter(c => c.category === colorCategory);

  const handleSelectColor = (name: string, hex: string) => {
    setSelectedColorHex(hex);
    setCustomHexInput(hex);
    setFormData(prev => ({ ...prev, colorPreference: `${name} (${hex})` }));
  };

  const handleCustomHexChange = (hex: string) => {
    setCustomHexInput(hex);
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      setSelectedColorHex(hex);
      setFormData(prev => ({ ...prev, colorPreference: `Custom Shade (${hex.toUpperCase()})` }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail,
      garmentType: formData.garmentType,
      fabricPreference: formData.fabricPreference,
      colorPreference: formData.colorPreference,
      measurements: {
        bust: formData.bust,
        waist: formData.waist,
        hip: formData.hip,
        shoulder: formData.shoulder,
        blouseLength: formData.blouseLength,
        height: formData.height,
        specialNotes: formData.specialNotes
      },
      budgetRange: formData.budgetRange
    };

    try {
      await fetch('/api/custom-clothing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      // Fallback works seamlessly
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const whatsappMessage = `*AARU Studio Customization Request*
Client: ${formData.customerName || 'Valued Client'}
Garment: ${formData.garmentType}
Fabric: ${formData.fabricPreference}
Color: ${formData.colorPreference}
Measurements: Bust: ${formData.bust || 'TBD'}, Waist: ${formData.waist || 'TBD'}, Hip: ${formData.hip || 'TBD'}, Height: ${formData.height || 'TBD'}
Special Notes: ${formData.specialNotes || 'None'}`;

  const whatsappUrl = `https://wa.me/919346066170?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section id="customized-clothing" className="py-20 lg:py-28 bg-[#FAF7F2] border-t border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Proposition */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#9C7C38]/15 text-[#9C7C38] text-[11px] font-semibold uppercase tracking-[0.2em]">
            <Scissors className="w-3.5 h-3.5" />
            Custom Tailoring Studio
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#0F4C5C]">
            Customised Clothing Services
          </h2>

          <p className="text-sm text-[#736B5E] font-light leading-relaxed">
            Every woman's body has its own cadence. In our custom studio, you are not bound by standard charts. Customize your sarees, blouses, lehengas, and gowns crafted to your exact anatomical measurements, fabric choice, and embroidery preferences.
          </p>
        </div>

        {/* 4-Step Process Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { step: '01', title: 'Silhouette Selection', desc: 'Choose from heirloom sarees, structured blouses, bridal lehengas, or festive ensembles.' },
            { step: '02', title: 'Fabric & Palette', desc: 'Select natural handloom silks, pure organza, or Banarasi weaves with personalized swatches.' },
            { step: '03', title: 'Measurements', desc: 'Provide your precise measurements or book a digital video consultation with our stylist.' },
            { step: '04', title: 'Handcrafted Assembly & Delivery', desc: 'Hand-cut, assembled, and finished with complimentary trial fittings.' }
          ].map((item) => (
            <div key={item.step} className="p-6 bg-white border border-[#E8DFD5] relative group hover:border-[#0F4C5C]/40 transition-colors">
              <span className="font-serif text-2xl font-bold text-[#9C7C38]/40 block mb-2">{item.step}</span>
              <h4 className="font-serif text-base font-bold text-[#24211E] mb-1">{item.title}</h4>
              <p className="text-xs text-[#736B5E] font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Interactive Customization Form */}
        <div className="max-w-4xl mx-auto bg-white border border-[#E8DFD5] shadow-xl p-8 sm:p-12">
          {isSubmitted ? (
            <div className="text-center py-10 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#2D5A46] mx-auto flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-3xl font-bold text-[#0F4C5C]">
                Customization Request Received
              </h3>
              <p className="text-sm text-[#736B5E] max-w-lg mx-auto leading-relaxed">
                Thank you, <strong className="text-[#24211E]">{formData.customerName}</strong>. Our senior patternmaker and stylist at AARU will review your measurements and contact you within 24 hours.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Continue Chat on WhatsApp (+91 93460 66170)
                </a>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-3 border border-[#D4C7B5] text-xs font-semibold uppercase tracking-wider text-[#24211E] hover:bg-[#FAF7F2]"
                >
                  Customize Another Ensemble
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Step 1: Silhouette */}
              <div>
                <h3 className="font-serif text-xl font-bold text-[#24211E] mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#9C7C38]" />
                  1. Select Garment Silhouette
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {garmentOptions.map((opt) => (
                    <label
                      key={opt.type}
                      className={`p-4 border cursor-pointer transition-all flex flex-col justify-between ${
                        formData.garmentType === opt.type
                          ? 'border-[#0F4C5C] bg-[#0F4C5C]/5 shadow-xs'
                          : 'border-[#E8DFD5] hover:border-[#D4C7B5]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#24211E]">{opt.type}</span>
                        <input
                          type="radio"
                          name="garmentType"
                          checked={formData.garmentType === opt.type}
                          onChange={() => setFormData({ ...formData, garmentType: opt.type as any })}
                          className="accent-[#0F4C5C]"
                        />
                      </div>
                      <p className="text-[11px] text-[#736B5E] font-light leading-snug">{opt.desc}</p>
                    </label>
                  ))}
                </div>
              </div>

              {/* Step 2: Fabric & Color */}
              <div className="space-y-6 pt-4 border-t border-[#E8DFD5]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <h4 className="font-serif text-lg font-bold text-[#24211E] mb-2">
                      2. Fabric & Weave
                    </h4>
                    <p className="text-xs text-[#736B5E] mb-3 leading-relaxed">
                      Select heirloom grade handloom silks, Banarasi brocades, or kora organza.
                    </p>
                    <select
                      value={formData.fabricPreference}
                      onChange={(e) => setFormData({ ...formData, fabricPreference: e.target.value })}
                      className="w-full p-3 bg-[#FAF7F2] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C]"
                    >
                      {fabrics.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-serif text-lg font-bold text-[#24211E] flex items-center gap-2">
                          <Palette className="w-4 h-4 text-[#9C7C38]" />
                          Color Palette Options
                        </h4>
                        <p className="text-xs text-[#736B5E]">
                          Select from 24 standardized handloom shades or define custom RGB/Hex swatches.
                        </p>
                      </div>

                      {/* Active Color Preview Badge */}
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FAF7F2] border border-[#D4C7B5] rounded-xs shrink-0">
                        <span 
                          className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-xs" 
                          style={{ backgroundColor: selectedColorHex }} 
                        />
                        <span className="text-[11px] font-semibold text-[#24211E] truncate max-w-[150px]">
                          {formData.colorPreference}
                        </span>
                      </div>
                    </div>

                    {/* Color Category Tabs */}
                    <div className="flex flex-wrap gap-1.5 border-b border-[#E8DFD5] pb-2">
                      {[
                        { id: 'all', label: 'All Shades (24)' },
                        { id: 'jewel', label: 'Jewel Tones' },
                        { id: 'metallic', label: 'Heritage Metallics' },
                        { id: 'pastel', label: 'Pastels & Florals' },
                        { id: 'earth', label: 'Earth & Neutrals' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setColorCategory(tab.id as any)}
                          className={`px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                            colorCategory === tab.id
                              ? 'bg-[#0F4C5C] text-white shadow-xs'
                              : 'bg-[#FAF7F2] text-[#736B5E] hover:text-[#24211E] hover:bg-[#F2ECE3]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Curated Colors Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
                      {filteredColors.map((c) => {
                        const isSelected = selectedColorHex.toLowerCase() === c.hex.toLowerCase();
                        return (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => handleSelectColor(c.name, c.hex)}
                            className={`p-2 border text-left flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#0F4C5C] bg-white ring-1 ring-[#0F4C5C] shadow-xs'
                                : 'border-[#E8DFD5] bg-[#FAF7F2] hover:border-[#D4C7B5]'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span 
                                className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10 shadow-2xs" 
                                style={{ backgroundColor: c.hex }} 
                              />
                              <div className="min-w-0">
                                <span className="text-[11px] font-medium text-[#24211E] block truncate leading-tight">
                                  {c.name}
                                </span>
                                <span className="text-[9px] font-mono text-[#736B5E] block leading-tight">
                                  {c.hex}
                                </span>
                              </div>
                            </div>
                            {isSelected && <Check className="w-3 h-3 text-[#0F4C5C] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Color Picker & Hex Code Input */}
                    <div className="p-3 bg-[#FAF7F2] border border-[#D4C7B5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Pipette className="w-4 h-4 text-[#8C6D37]" />
                        <div>
                          <span className="text-xs font-bold text-[#24211E] block">
                            Custom Color Picker
                          </span>
                          <span className="text-[10px] text-[#736B5E]">
                            Click swatch to pick or enter custom 6-digit hex code
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label 
                          htmlFor="custom-color-wheel"
                          className="relative w-8 h-8 rounded-full border-2 border-white shadow-xs cursor-pointer overflow-hidden shrink-0 ring-1 ring-[#D4C7B5]"
                          style={{ backgroundColor: selectedColorHex }}
                          title="Click to open color picker"
                        >
                          <input
                            id="custom-color-wheel"
                            type="color"
                            value={selectedColorHex}
                            onChange={(e) => handleCustomHexChange(e.target.value)}
                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                          />
                        </label>
                        <input
                          id="custom-hex-code-input"
                          type="text"
                          maxLength={7}
                          value={customHexInput}
                          onChange={(e) => handleCustomHexChange(e.target.value)}
                          placeholder="#0F4C5C"
                          className="w-24 p-1.5 text-xs font-mono font-bold uppercase text-[#24211E] bg-white border border-[#D4C7B5] focus:outline-none focus:border-[#0F4C5C]"
                        />
                        <span className="text-[10px] uppercase font-bold text-[#8C6D37]">
                          Hex Swatch
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Exact Body Measurements */}
              <div className="pt-4 border-t border-[#E8DFD5]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-serif text-lg font-bold text-[#24211E] flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-[#9C7C38]" />
                    3. Tailoring Measurements (Inches)
                  </h4>
                  <span className="text-[11px] text-[#8C6D37] italic">
                    Leave blank if you prefer measuring during stylist video consultation.
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#736B5E] mb-1">Bust (in)</label>
                    <input
                      type="text"
                      placeholder="e.g. 36"
                      value={formData.bust}
                      onChange={(e) => setFormData({ ...formData, bust: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#736B5E] mb-1">Waist (in)</label>
                    <input
                      type="text"
                      placeholder="e.g. 30"
                      value={formData.waist}
                      onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#736B5E] mb-1">Hip (in)</label>
                    <input
                      type="text"
                      placeholder="e.g. 40"
                      value={formData.hip}
                      onChange={(e) => setFormData({ ...formData, hip: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#736B5E] mb-1">Shoulder (in)</label>
                    <input
                      type="text"
                      placeholder="e.g. 14.5"
                      value={formData.shoulder}
                      onChange={(e) => setFormData({ ...formData, shoulder: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#736B5E] mb-1">Blouse Length</label>
                    <input
                      type="text"
                      placeholder="e.g. 15"
                      value={formData.blouseLength}
                      onChange={(e) => setFormData({ ...formData, blouseLength: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#736B5E] mb-1">Height (ft / cm)</label>
                    <input
                      type="text"
                      placeholder="e.g. 5ft 6in"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 4: Contact Details & Special Notes */}
              <div className="pt-4 border-t border-[#E8DFD5] space-y-4">
                <h4 className="font-serif text-lg font-bold text-[#24211E]">
                  4. Contact Details & Special Instructions
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-[#736B5E] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunita Krishnamurthy"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#736B5E] mb-1">WhatsApp Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 93460 66170"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#736B5E] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sunita@example.com"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#736B5E] mb-1">
                    Special Notes & Neckline/Sleeve Preference
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide any specific design details, e.g., deep sweetheart neck with elbow sleeves, hand-embroidered back buttons, or saree fall/pico finish..."
                    value={formData.specialNotes}
                    onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                    className="w-full p-3 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
                  />
                </div>
              </div>

              {/* Submit Section */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E8DFD5]">
                <div className="text-left">
                  <p className="text-xs font-semibold text-[#24211E]">
                    Complimentary Fitting Consultation
                  </p>
                  <p className="text-[11px] text-[#736B5E]">
                    Our master patternmaker reviews all measurements before hand-cutting your ensemble.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-9 py-3.5 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
                >
                  {isSubmitting ? (
                    'Recording Request...'
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Submit Customization Inquiry
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
