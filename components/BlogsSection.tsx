'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import { BlogPost, INITIAL_BLOGS } from '@/lib/data';
import { useApp } from '@/context/AppContext';

export const BlogsSection: React.FC = () => {
  const { blogs } = useApp();
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  const displayBlogs = (blogs && blogs.length > 0) ? blogs : INITIAL_BLOGS;

  return (
    <section id="blogs" className="py-20 bg-[#F7FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0A2540] bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full">
            Clinical Insights & Parent Guidance
          </span>

          <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Latest Pediatric Health Articles
          </h2>

          <p className="text-slate-600 text-sm sm:text-base">
            Evidence-based medical advice written by Founder & Speech Therapist Kajal Kavita at Jeevan Wings Speech Therapy & Child Development Center, Noida.
          </p>
        </div>

        {/* Blogs Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-[20px] overflow-hidden border border-slate-200/80 soft-shadow soft-shadow-hover flex flex-col justify-between"
            >
              <div>
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                  referrerPolicy="no-referrer"
                />

                <div className="p-6">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-bold text-[#0A2540] uppercase">{blog.category}</span>
                    <span>{blog.readTime}</span>
                  </div>

                  <h3 className="font-poppins font-bold text-base text-slate-900 line-clamp-2 hover:text-[#0A2540] transition-colors cursor-pointer" onClick={() => setSelectedBlog(blog)}>
                    {blog.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm mt-2 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{blog.author}</span>
                    <span>{blog.publishDate}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                <button
                  onClick={() => setSelectedBlog(blog)}
                  className="w-full bg-orange-50 hover:bg-[#EA580C] text-[#EA580C] hover:text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 border border-orange-200/60"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Blog Article Reader Modal */}
        <AnimatePresence>
          {selectedBlog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[24px] shadow-2xl border border-slate-100 w-full max-w-3xl overflow-hidden my-8"
              >
                <div className="bg-[#0A2540] p-6 text-white flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#EA580C] uppercase tracking-wider block">
                      Jeevan Wings Medical Journal
                    </span>
                    <h3 className="font-poppins font-bold text-lg text-white line-clamp-1">
                      {selectedBlog.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBlog(null);
                    }}
                    className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                  <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
                    <div>
                      <strong className="text-slate-800">{selectedBlog.author}</strong> ({selectedBlog.authorRole})
                    </div>
                    <div>Published: {selectedBlog.publishDate}</div>
                  </div>

                  <img
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    className="w-full h-64 object-cover rounded-2xl"
                    referrerPolicy="no-referrer"
                  />

                  <div className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed whitespace-pre-line">
                    {selectedBlog.content}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
