import { type FormWithFields } from "~/types/prismaRelations";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { BsCameraFill } from "react-icons/bs";
import Compressor from "compressorjs";
import { useState } from "react";

type FormProps = {
  form: FormWithFields;
};

const Form: React.FC<FormProps> = ({ form }) => {
  const { register, handleSubmit } = useForm();
  const [images, setImages] = useState<string[]>([]);

  const handleImageAttach = (e: any) => {
    Array.from(e.target.files).forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = (onLoadEvent: any) => {
        setImages((imageState: string[]) => [
          ...imageState,
          onLoadEvent.target.result,
        ]);
      };
      new Compressor(file, {
        quality: 0.6,
        maxHeight: 1422,
        maxWidth: 800,
        success(result) {
          reader.readAsDataURL(result);
        },
      });
    });
  };

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col">
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email", { required: true })} placeholder="Email" />
        {form.fields.map((field) => {
          switch (field.type) {
            case "text":
              return (
                <input
                  key={field.id}
                  {...register(field.id, { required: true })}
                  placeholder={field.name}
                />
              );
          }
        })}
        <BsCameraFill
          onClick={() => {
            document.getElementById("images-input")?.click();
          }}
          className="text-3xl text-white"
        ></BsCameraFill>
        <input
          hidden
          id="images-input"
          accept="image/*"
          type={"file"}
          multiple
          {...register("file", { required: true })}
          onChange={handleImageAttach}
        />
        <input type="submit" />
      </form>
    </div>
  );
};

export default Form;
