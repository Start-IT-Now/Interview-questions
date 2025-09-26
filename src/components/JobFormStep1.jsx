import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Clock, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MAX_EXPERIENCE = 50; // Maximum years of experience allowed
const MIN_EXPERIENCE = 0;  // Minimum years of experience allowed
const EXPERIENCE_STEP = 1; // Step for increment/decrement

// Floating icon component
const FloatingIcon = ({ children, className }) => (
  <motion.div
    className={`absolute bg-white/20 backdrop-blur-sm p-3 rounded-full shadow-lg ${className}`}
    initial={{ y: 0, opacity: 0, scale: 0.5 }}
    animate={{ y: [0, -10, 0], opacity: 1, scale: 1 }}
    transition={{ duration: 3, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

  const JobFormStep1 = ({ formData, handleInputChange, onNewSubmit, jobDescription }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.jobTitle) newErrors.jobTitle = 'Job Title is required';
    if (!formData.requiredSkills) newErrors.requiredSkills = 'Please enter one or more skills';
    if (!formData.minExperience) newErrors.minExperience = 'Min Experience is required';
    if (!formData.maxExperience) newErrors.maxExperience = 'Max Experience is required';
    if (!formData.industry) newErrors.industry = 'Industry is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      const result = await onNewSubmit(formData); // Must return string

      const skillsArray = formData.requiredSkills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean);
      localStorage.setItem('keySkills', JSON.stringify(skillsArray));
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-grow flex flex-col items-start justify-start px-4 py-10">
          {isLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md">
              <div className="text-lg font-semibold text-blue-600 animate-pulse">
                Processing...
              </div>
            </div>
          )}

          {/* Layout */}
          <div className="w-full max-w-7xl flex flex-col lg:flex-row items-start justify-start gap-12 relative px-6 lg:pl-20 lg:pr-8 py-24">

            {/* Floating Icons */}
            <div className="hidden lg:block">
              <FloatingIcon className="top-10 -left-8 text-blue-500">
                <Briefcase size={24} />
              </FloatingIcon>
              <FloatingIcon className="bottom-16 -right-8 text-green-500">
                <Star size={24} />
              </FloatingIcon>
            </div>

            {/* LEFT: Form */}
            <div className="flex flex-col space-y-8 max-w-2xl w-full">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                <div className="mb-2 text-left">
                  <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-orange-400 drop-shadow-md">
                    AI Generated <br/>
                    <span className="text-black">Interview Questions</span>
                  </h1>
                  <p className="mt-4 text-lg text-gray-500 max-w-xl">
                    Built with AI. Designed for Recruiters.
                  </p>
                </div>
              </motion.div>

              <motion.div layout className="w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-sky-50/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full"
                >

                  {/* Job Type & Skills */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 mb-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Job Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="e.g. Senior Frontend Developer"
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        className="bg-white/70"
                        disabled={isLoading}
                      />
                      {errors.jobTitle && (
                        <p className="text-red-600 text-sm">{errors.jobTitle}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Key Skills <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="e.g. JAVA, REACT"
                        value={formData.requiredSkills}
                        onChange={(e) => handleInputChange('requiredSkills', e.target.value)}
                        className="bg-white/70"
                        disabled={isLoading}
                      />
                      {errors.requiredSkills && (
                        <p className="text-red-600 text-sm">{errors.requiredSkills}</p>
                      )}
                    </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                 {/* Min Experience */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Min Experience <span className="text-red-500">*</span>
                      </Label>
                      <Input
      type="number"
      name="minExperience"
      value={formData.minExperience || ""}
      onChange={(e) => {
        let value = e.target.value.replace(/\D/g, ""); // digits only
        value = Math.max(MIN_EXPERIENCE, Math.min(MAX_EXPERIENCE, value)); // clamp 0–50
        handleInputChange("minExperience", value);
      }}
      className="bg-white/70"
      placeholder="e.g. 3"
      min={MIN_EXPERIENCE}
      max={MAX_EXPERIENCE}
      step={EXPERIENCE_STEP}
    />
  </div>

                    {/* Max Experience */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Max Experience <span className="text-red-500">*</span>
                      </Label>
    <Input
      type="number"
      name="maxExperience"
      value={formData.maxExperience || ""}
      onChange={(e) => {
        let value = e.target.value.replace(/\D/g, "");
        value = Math.max(MIN_EXPERIENCE, Math.min(MAX_EXPERIENCE, value));
        handleInputChange("maxExperience", value);
      }}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      placeholder="e.g. 6"
      min={MIN_EXPERIENCE}
      max={MAX_EXPERIENCE}
      step={EXPERIENCE_STEP}
    />
  </div>
</div>

                    
                    {/* Industry */}
                      <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Industry <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="e.g. Information Technology, Marketing"
                        value={formData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        className="bg-white/70"
                        disabled={isLoading}
                      />
                      {errors.industry && (
                        <p className="text-red-600 text-sm">{errors.industry}</p>
                      )}
                    </div>


                  {/* Submit Button */}
                  <Button
                    onClick={onSubmit}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 mt-4"
                  >
                    {isLoading ? 'Processing...' : 'Submit'}
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT: Job Description Card */}
            {jobDescription && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-xl w-full text-gray-900 overflow-y-auto max-h-[80vh]"
              >
                <h2 className="text-2xl font-bold mb-4 text-blue-800">
                  Questions & Answers
                </h2>
{Array.isArray(jobDescription) ? (
  <div className="space-y-4">
    {jobDescription.map((qa, idx) => (
      <div key={idx} className="border-b pb-2">
        <p className="font-semibold text-gray-800">
          Q{idx + 1}: {qa.question}
        </p>
        <p className="text-gray-600 mt-1">
          {qa.answer}
        </p>
      </div>
    ))}
  </div>
) : (
  <pre className="whitespace-pre-wrap text-sm font-medium font-serif leading-relaxed text-gray-900">
    {jobDescription}
  </pre>
)}

              </motion.div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default JobFormStep1;
