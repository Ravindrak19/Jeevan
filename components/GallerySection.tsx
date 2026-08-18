'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Eye, X } from 'lucide-react';
import { GalleryItem, INITIAL_GALLERY } from '@/lib/data';
import { useApp } from '@/context/AppContext';

export const GallerySection: React.FC = () => {
  const { gallery } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const activeGallery = (gallery && gallery.length > 0) ? gallery : INITIAL_GALLERY;

  const categories = ['All', 'Sensory Gym', 'Speech Labs', 'Play Rooms', 'Events & Workshops', 'Infrastructure'];

  const filteredGallery = activeCategory === 'All'
    ? activeGallery
    : activeGallery.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0A2540] bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full">
            Noida Sector 75 Facility
          </span>

          <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Sensory Gym & Clinical Infrastructure
          </h2>

          <p className="text-slate-600 text-sm sm:text-base">
            Take a visual tour of our modern speech & language labs, play therapy environments, and clinical rooms designed for maximum child comfort.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[#EA580C] text-white shadow-md shadow-orange-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="group relative rounded-[20px] overflow-hidden bg-slate-900 shadow-md cursor-pointer border border-slate-100"
              onClick={() => setSelectedImage(item)}
            >
              <img
                src={item.imageUrl}
                alt={item.altText}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold text-[#EA580C] bg-slate-900/80 px-2 py-0.5 rounded-md border border-white/20">
                  {item.category}
                </span>
                <h4 className="font-poppins font-bold text-sm mt-1">{item.title}</h4>
                <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">{item.description}</p>
              </div>

              <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Image Zoom Modal */}
        <AnimatePresence>
          {selectedImage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[24px] overflow-hidden max-w-3xl w-full shadow-2xl relative"
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 z-10 p-2 bg-slate-900/60 text-white hover:bg-slate-900 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.altText}
                  className="w-full max-h-[70vh] object-cover"
                  referrerPolicy="no-referrer"
                />

                <div className="p-6 bg-white">
                  <span className="text-xs font-bold text-[#0A2540] uppercase tracking-wider">{selectedImage.category}</span>
                  <h3 className="font-poppins font-bold text-xl text-slate-900 mt-1">{selectedImage.title}</h3>
                  <p className="text-slate-600 text-sm mt-2">{selectedImage.description}</p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
