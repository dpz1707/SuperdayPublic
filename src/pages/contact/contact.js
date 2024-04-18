import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import emailjs from 'emailjs-com';
import OnSuccessPopup from '../../components/OnSuccessPopup'

export default function Contact() {
   const { register, handleSubmit, reset, formState: { errors } } = useForm();
   const [showSuccessMessage, setShowSuccessMessage] = useState(false);


   const onSubmit = async (data) => {
      // Construct templateParams with the data received from the form
      const templateParams = {
         name: data.name,
         email: data.email,
         subject: data.subject,
         message: data.message,
      };

      try {
         await emailjs.send(
            process.env.REACT_APP_SERVICE_ID,
            process.env.REACT_APP_TEMPLATE_ID,
            templateParams, // Use the dynamically constructed templateParams
            process.env.REACT_APP_PUBLIC_KEY
         );
         setShowSuccessMessage(true)
         reset(); // Reset form fields after successful submission
      } catch (e) {
         console.error(e);
         alert('Failed to send the message, please try again.');
      }
   };

   return (
      <div className="flex flex-col min-h-[100vh]">
         <div className="w-full max-w-2xl px-6">
            <div className="mb-10 text-center">
               <h1 className="text-5xl font-medium mb-4">Let's get in touch.</h1>
               <p className="text-lg text-gray-600">Feedback, new feature requests, or found a bug? Let us know.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
               <div className="mb-6">
                  <input
                     {...register("name", { required: true })}
                     type="text"
                     placeholder="Your Name"
                     className="w-full p-3 text-md border border-gray-300 rounded"
                  />
               </div>
               <div className="mb-6">
                  <input
                     {...register("email", { required: true })}
                     type="email"
                     placeholder="Your Email"
                     className="w-full p-3 text-md border border-gray-300 rounded"
                  />
               </div>
               <div className="mb-6">
                  <select
                     {...register("subject", { required: true })}
                     className="w-full p-3 text-md border border-gray-300 rounded bg-white"
                  >
                     <option value="" disabled>Message Type</option>
                     <option value="Request a Feature">Request a Feature</option>
                     <option value="Report a Bug">Report a Bug</option>
                     <option value="Feedback">Feedback</option>
                     <option value="Other">Other</option>
                  </select>
               </div>
               <div className="mb-6">
                  <textarea
                     {...register("message", { required: true })}
                     placeholder="Your Message"
                     className="w-full p-3 text-md border border-gray-300 rounded"
                     rows="3"
                  ></textarea>
               </div>
               <div className="flex justify-center items-center">
                  <button type="submit" className=" border border-black px-16 py-3 font-medium text-white bg-black rounded-full hover:bg-transparent hover:text-black transition duration-500 ease-in-out">
                     Submit Form
                  </button>
               </div>
            </form>
            <OnSuccessPopup showSuccessMessage={showSuccessMessage} successMessage={'Your message has been submitted!'}></OnSuccessPopup>

         </div>
      </div>
   );
}
