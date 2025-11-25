import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Clock, Star, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const FloatingIcon = ({ children, className }) => (
  <motion.div
    className={`absolute bg-white/20 backdrop-blur-sm p-3 rounded-full shadow-lg ${className}`}
    initial={{ y: 0, opacity: 0, scale: 0.5 }}
    animate={{ y: [0, -10, 0], opacity: 1, scale: 1 }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

const JobDescriptionEditor = ({
  value,
  onChange,
  minWords = 100,
  maxWords = 200,
  onValidChange,
  readOnly,
}) => {
  const [error, setError] = useState("");

  const countWords = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  useEffect(() => {
    const wordCount = countWords(value);
    if (wordCount < minWords)
      setError(`Minimum ${minWords} words (currently ${wordCount})`);
    else if (wordCount > maxWords)
      setError(`Maximum ${maxWords} words (currently ${wordCount})`);
    else setError("");
    onValidChange && onValidChange(!error);
  }, [value]);

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={{
          toolbar: [["bold", "italic", "underline"], [{ header: [1, 2, 3, false] }], ["clean"]],
        }}
        formats={["bold", "italic", "underline", "header"]}
        placeholder="Describe the role, responsibilities, requirements..."
        className="bg-white/70 border border-gray-300 rounded-md min-h-[160px]"
        readOnly={readOnly}
      />
      {error && <p className="text-red-600 mt-1 text-sm">{error}</p>}
    </div>
  );
};

const JobFormStep1 = ({ formData, handleInputChange, onNewSubmit, jobDescription }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [jobDescriptionIsValid, setJobDescriptionIsValid] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.jobTitle) newErrors.jobTitle = "Job Title is required";
    if (!formData.requiredSkills) newErrors.requiredSkills = "Please enter one or more skills";
    if (!formData.industry) newErrors.industry = "Industry is required";
    if (!jobDescriptionIsValid)
      newErrors.jobDescription = "Job description must be between 100 and 200 words";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await onNewSubmit(formData);
      const skillsArray = formData.requiredSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      localStorage.setItem("keySkills", JSON.stringify(skillsArray));
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-4 flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col items-start justify-start px-2 py-2">
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md">
            <div className="text-lg font-semibold text-blue-600 animate-pulse">Processing...</div>
          </div>
        )}

          <div className="w-full max-w-[95%] flex flex-col lg:flex-row gap-12 relative px-2 lg:px-2 py-2 items-start justify-between">

          {/* Floating Icons */}
          <div className="hidden lg:block">
            <FloatingIcon className="top-6 -left-6 text-blue-500">
              <Briefcase size={24} />
            </FloatingIcon>
            <FloatingIcon className="bottom-10 -right-8 text-green-500">
              <Star size={24} />
            </FloatingIcon>
          </div>

          {/* LEFT SIDE */}
          <div className="flex flex-col space-y-6 w-full lg:w-[48%] max-w-[600px] bg-sky-50/70 rounded-2xl shadow-lg p-6">

              <h1 className="text-4xl font-extrabold text-orange-400 leading-tight">
                AI Generated <br />
                <span className="text-black">Interview Questions</span>
              </h1>
              <p className="mt-2 text-gray-600">Built with AI. Designed for Recruiters.</p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-sky-50/70 rounded-2xl shadow-lg p-6"
            >
              {/* Job Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-4 h-4" /> Job Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. Senior Frontend Developer"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.jobTitle && <p className="text-red-600 text-sm">{errors.jobTitle}</p>}
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    < Settings className="w-4 h-4" /> Key Skills <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. JAVA, REACT"
                    value={formData.requiredSkills}
                    onChange={(e) => handleInputChange("requiredSkills", e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.requiredSkills && (
                    <p className="text-red-600 text-sm">{errors.requiredSkills}</p>
                  )}
                </div>
              </div>

              {/* Experience & Industry */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label className="flex items-center gap-2 mb-3 text-slate-800 font-semibold">
                    <Clock className="w-4 h-4" /> Experience
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g. 3"
                    value={formData.experience}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*$/.test(val)) handleInputChange("experience", );
                    }}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-4 h-4" /> Industry <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. Information Technology"
                    value={formData.industry}
                    onChange={(e) => handleInputChange("industry", e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.industry && <p className="text-red-600 text-sm">{errors.industry}</p>}
                </div>
              </div>

              {/* Job Description */}
              <div className="mt-4">
                <Label className="flex items-center gap-2 text-slate-800 font-semibold mb-3">
                  <FileText className="w-4 h-4" /> Context <span className="text-red-500">*</span>
                </Label>
                <JobDescriptionEditor
                  value={formData.jobDescription}
                  onChange={(v) => handleInputChange("jobDescription", v)}
                  onValidChange={setJobDescriptionIsValid}
                  readOnly={isLoading}
                />
                {errors.jobDescription && (
                  <p className="text-red-600 text-sm">{errors.jobDescription}</p>
                )}
              </div>

              <Button
                onClick={onSubmit}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 mt-4"
              >
                {isLoading ? "Processing..." : "Submit"}
              </Button>
            </motion.div>
          </div>

          {/* RIGHT SIDE */}
          {jobDescription && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-200 rounded-2xl shadow-xl p-8 w-[40%] text-gray-900 overflow-y-auto flex-grow"

            >
              <h2 className="text-2xl font-bold mb-3 text-blue-800">Qualification Questions</h2>
              {Array.isArray(jobDescription) ? (
                <div className="space-y-3">
                  {jobDescription.map((qa, idx) => (
                    <div key={idx} className="border-b pb-2">
                      <p className="font-semibold text-gray-800">
                        Q{idx + 1}: {qa.question}
                      </p>
                      <p className="text-gray-600 mt-1">{qa.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <pre className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-gray-900">
                  {jobDescription}
                </pre>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobFormStep1;
