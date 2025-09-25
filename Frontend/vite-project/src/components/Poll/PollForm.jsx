import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";

const PollForm = ({ onCreatePoll }) => {
  // ✅ Validation schema
  const validationSchema = Yup.object({
    question: Yup.string().required("Poll question is required"),
    options: Yup.array()
      .of(Yup.string().required("Option cannot be empty"))
      .min(2, "At least 2 options are required"),
  });

  // ✅ Initial values
  const initialValues = {
    question: "",
    options: ["", ""], // Start with 2 empty options
  };

  // ✅ Submit handler
  const handleSubmit = (values, { resetForm }) => {
    onCreatePoll({
      ...values,
      status: "draft",
      id: Date.now(),
    });
    resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <Form>
          <div>
            <label htmlFor="question">Poll Question:</label>
            <Field
              type="text"
              id="question"
              name="question"
              placeholder="Enter your poll question"
            />
            <ErrorMessage
              name="question"
              component="div"
              style={{ color: "red", fontSize: "0.9em" }}
            />
          </div>

          <FieldArray name="options">
            {({ push, remove }) => (
              <div>
                {values.options.map((option, idx) => (
                  <div key={idx}>
                    <Field
                      type="text"
                      name={`options[${idx}]`}
                      placeholder={`Option ${idx + 1}`}
                    />
                    <ErrorMessage
                      name={`options[${idx}]`}
                      component="div"
                      style={{ color: "red", fontSize: "0.9em" }}
                    />
                    {idx >= 2 && (
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        style={{ marginLeft: "5px" }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => push("")}
                  style={{ marginTop: "10px" }}
                >
                  Add Option
                </button>
              </div>
            )}
          </FieldArray>

          <button type="submit" style={{ marginTop: "15px" }}>
            Create Poll
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default PollForm;
