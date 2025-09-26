import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import JobFormStep1 from '@/components/JobFormStep1';
import logo from './logo.png';
import Footer from '@/components/Footer';
import pic from './pic.png';

function App() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    minExperience: '',
    maxExperience: '',
    requiredSkills: '',
    industry: '',
  });

  const [jobDescription, setJobDescription] = useState(null);

  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNewSubmit = async (data) => {
    try {
      const jobPayload = {
        org_id: 1,
        exe_name: 'run1',
        workflow_id: 'interview_questions',
        job_description: `Looking for ${data.jobTitle} with the ${data.requiredSkills} skill of min experience of ${data.minExperience} years and max experience ${data.maxExperience} years in ${data.industry} domain.`,
      };

      console.log('📤 Final Payload:', jobPayload);

      const formData = new FormData();
      formData.append('data', JSON.stringify(jobPayload));

      const response = await fetch(
        'https://agentic-ai.co.in/api/agentic-ai/workflow-exe',
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();
      console.log('📥 Full API Response:', result);

      if (!response.ok) {
        throw new Error(result?.message || `Upload failed with status ${response.status}`);
      }

      const jobDesc = result?.data?.result?.[0];
      console.log('📥 Extracted jobDesc:', jobDesc);

      // ✅ Save into state so it appears in JobFormStep1
      setJobDescription(jobDesc);

      toast({
        title: 'Success!',
        description: 'Job description created successfully.',
      });

      return jobDesc;
    } catch (error) {
      console.error('❌ Upload failed:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || '❌ Something went wrong.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 relative overflow-hidden">
      <Helmet>
        <title>Talent Sift - Interview Questions</title>
        <meta
          name="Questions"
          content="Create and post job opportunities with Talent Sift's intuitive job posting platform"
        />
      </Helmet>

      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-lg animate-pulse delay-1000"></div>
      </motion.div>

      <div
        className="relative min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url(${pic})` }}
      >
        {/* Header */}
        <div className="p-8 flex items-center justify-start space-x-4">
          <img src={logo} alt="Talent Sift Logo" className="h-10" />
          <div className="absolute top-0 right-0 p-4 flex items-center justify-end space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-blue font-bold">T</span>
            </div>
            <span className="text-2xl font-serif font-bold text-gray-800">Talent</span>
            <span className="text-2xl font-sans font-extrabold text-gray-500">Sift</span>
          </div>
        </div>

        {/* Main Form */}
        <div className="flex-1 flex justify-start p-4">
          <JobFormStep1
            formData={formData}
            handleInputChange={handleInputChange}
            onNewSubmit={handleNewSubmit}
            jobDescription={jobDescription} 
          />
        </div>

        <Toaster />
        <footer className="mt-auto">
          <Footer />
        </footer>
      </div>
    </div>
  );
}

export default App;
