"use client";

import { FC, useRef } from "react";
// import emailjs from "emailjs-com";
import emailjs from '@emailjs/browser';
import { useState } from "react";
import { ContactSchema, ContactType } from "@/schema/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

interface ContactFormProps {}

const ContactForm: FC<ContactFormProps> = ({}) => {
    const [submitSuccess, setSubmitSuccess] = useState(false); // 送信成功状態を追跡するための状態
    const form = useRef<HTMLFormElement>(null);

  const handleOnSubmit: SubmitHandler<ContactType> = async (data) => {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID; //ServeceIDを取得
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;// TemplateIDを取得
    const publicId = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_ID; // Public Keyを取得
    try {
        await emailjs.sendForm(serviceId!, templateId!, form.current!, publicId!);
        setSubmitSuccess(true);
        reset();
      } catch (error) {
      console.error("エラーが出ました" + error)
      }
    

  };

  const {
    register,
    handleSubmit,
    formState: { errors: formatError, isValid, isSubmitting },
    reset,
  } = useForm<ContactType>({
    mode: "onBlur",
    resolver: zodResolver(ContactSchema),
  });

  return (
    <form
      method="post"
      onSubmit={(event) => {
        void handleSubmit(handleOnSubmit)(event);
      }}
      className="flex flex-col space-y-4"
      ref={form}
    >
      <label className="flex flex-col">
        <div className="text-sm font-bold mb-1"></div>
        <input
          type="text"
          {...register("email")}
          className="w-full appearance-none bg-purple-700 border border-purple-500 focus:border-purple-300 rounded-sm px-4 py-3 mb-2 sm:mb-0 sm:mr-2 text-white placeholder-purple-400"
          placeholder="メールアドレス"
        />
        {formatError.email && (
          <div className="text-red-500 pl-1 pt-1 text-xs">
            {formatError.email.message}
          </div>
        )}
      </label>

      <label className="flex flex-col">
        <div className="text-sm font-bold mb-1"></div>
        <textarea
          {...register("message")}
          className="w-full appearance-none bg-purple-700 border border-purple-500 focus:border-purple-300 rounded-sm px-4 py-3 mb-2 sm:mb-0 sm:mr-2 text-white placeholder-purple-400"
        placeholder="お問い合わせ内容"></textarea>

        {formatError.message && (
          <div className="text-red-500 pl-1 pt-1 text-xs">
            {formatError.message.message}
          </div>
        )}
      </label>

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="btn text-purple-600 bg-purple-100 hover:bg-white shadow  disabled:bg-gray-300 md:self-center"
      >
        送信
      </button>
                    {/* Success message */}
              {/* <p className="text-center lg:text-left lg:absolute mt-2 opacity-75 text-sm">Thanks for subscribing!</p> */}
              {submitSuccess && (
          <div className="alert alert-success" role="alert">
            メッセージが正常に送信されました。ありがとうございます！
          </div>
        )}

    </form>
  );
};

export default ContactForm;