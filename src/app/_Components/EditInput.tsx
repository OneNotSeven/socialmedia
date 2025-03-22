"use client"
import { Input } from '@/components/ui/input'
import { updateProfile } from '@/controllers/controller'
import { useFormik } from 'formik'
import { Loader } from 'lucide-react'
import React, { useState } from 'react'
import * as Yup from 'yup';

const EditInput = ({ profileInfo, userId }: any) => {
  const [userExist, setUserExist] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    username: Yup.string()
      .matches(/^@[\w.-]+$/, "Username must start with @ and contain only letters, numbers, dots, or underscores")
      .required("Username is required"),
    bio: Yup.string().max(160, "Bio must be 160 characters or less"),
    website: Yup.string().url("Invalid URL format"),
    profession: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      name: profileInfo?.name || "",
      username: profileInfo?.username || "",
      bio: profileInfo?.bio || "",
      website: profileInfo?.website || "",
      profession: profileInfo?.profession || "",
      email: profileInfo?.email || "",
    },
    validationSchema,
    enableReinitialize: true, // ✅ Auto update Formik when profileInfo changes
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const realValues = Object.fromEntries(
          Object.entries(values).filter(([_, value]) => value.trim() !== "")
        );

        const changeProcess = await updateProfile(userId, realValues);
        if (!changeProcess.success && changeProcess.error === "user") {
          setUserExist(changeProcess.message);
        }
      } catch (error) {
        console.log("Something went wrong");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="sm:w-[90%] w-full text-[#202142]">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Personal Info
      </h2>

      {/* Name Input */}
      <div className="mb-2 sm:mb-6">
        <label className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
          Your Name
        </label>
        <Input
          type="text"
          name="name"
          value={formik.values.name}
          className="w-full p-2.5"
          placeholder="Your Name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.name && formik.touched.name && <p className="text-red-400 text-sm">{String(formik.errors.name)}</p>}
      </div>

      {/* Username Input */}
      <div className="mb-2 sm:mb-6">
        <label className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
          Username
        </label>
        <Input
          type="text"
          name="username"
          value={formik.values.username}
          className="w-full p-2.5"
          placeholder="@username"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.username && formik.touched.username && <p className="text-red-400 text-sm">{String(formik.errors.username)}</p>}
        {userExist && <p className="text-red-400 text-sm">{userExist}</p>}
      </div>

      {/* Email (Read-Only) */}
      <div className="mb-2 sm:mb-6">
        <label className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
          Your Email
        </label>
        <Input type="email" name="email" value={formik.values.email} className="w-full p-2.5" readOnly />
      </div>

      {/* Profession Input */}
      <div className="mb-2 sm:mb-6">
        <label className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
          Profession
        </label>
        <Input
          type="text"
          name="profession"
          value={formik.values.profession}
          className="w-full p-2.5"
          placeholder="Your Profession"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.profession && formik.touched.profession && <p className="text-red-400 text-sm">{String(formik.errors.profession)}</p>}
      </div>

      {/* Website Input */}
      <div className="mb-2 sm:mb-6">
        <label className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
          Website
        </label>
        <Input
          type="text"
          name="website"
          value={formik.values.website}
          className="w-full p-2.5"
          placeholder="Website URL"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.website && formik.touched.website && <p className="text-red-400 text-sm">{String(formik.errors.website)}</p>}
      </div>

      {/* Bio Input */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
          Bio
        </label>
        <textarea
          name="bio"
          value={formik.values.bio}
          className="block p-2.5 w-full text-sm text-indigo-900 bg-indigo-50 rounded-lg border border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Write your bio here..."
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.bio && formik.touched.bio && <p className="text-red-400 text-sm">{String(formik.errors.bio)}</p>}
      </div>

      {/* Save Button */}
      <div className="flex  w-full justify-center items-center">
        <button
          onClick={()=>formik.handleSubmit()}
          className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
        >
          {loading ? <span className='flex items-center'><Loader className="w-5 h-5 animate-spin" /></span> : <span>Save</span>}
        </button>
      </div>
    </div>
  );
};

export default EditInput;
