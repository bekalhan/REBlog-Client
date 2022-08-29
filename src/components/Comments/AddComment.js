import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createCommentAction } from "../../redux/slices/comments/commentSlices";

//Form schema
const formSchema = Yup.object({
  description: Yup.string().required("Description is required"),
});

const AddComment = ({ postId }) => {
  //dispatch
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      description: "",
    },
    onSubmit: values => {
      const data = {
        postId,
        description: values?.description,
      };
      //dispatch action
      dispatch(createCommentAction(data));
    },
    validationSchema: formSchema,
  });
  return (
    <div className="flex flex-col justify-center items-center">
      <form
        onSubmit={formik.handleSubmit}
        className="mt-1 flex max-w-sm m-auto"
      >
        <input
          onBlur={formik.handleBlur("description")}
          value={formik.values.description}
          onChange={formik.handleChange("description")}
          type="text"
          name="text"
          id="text"
          className="shadow-sm focus:ring-indigo-500  mr-2 focus:border-indigo-500 block w-full p-2 border-1 sm:text-sm border-gray-300 rounded-md"
          placeholder="Add New comment"
        />

        <button
          type="submit"
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
      <div className="text-red-400 mb-2 mt-2">
        {formik.touched.description && formik.errors.description}
      </div>
    </div>
  );
};

export default AddComment;
