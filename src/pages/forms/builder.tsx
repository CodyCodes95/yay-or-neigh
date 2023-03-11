import type { Field } from "@prisma/client";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const SortableItem = (props: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const { field } = props;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div key={field.id} className="flex flex-col p-2">
        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
          {field.name}
        </label>
        <input
          key={field.id}
          placeholder={field.name}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

const FormContainer: NextPage = () => {
  const router = useRouter();
  const { formId } = router.query;
  const form = api.form.getForm.useQuery(
    { formId: formId as string },
    {
      onSuccess: (data) => {
        setFields(data?.fields as Field[]);
      },
      enabled: !!formId,
    }
  );

  const [fields, setFields] = useState<Field[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    console.log(active, over);

    if (active.id !== over?.id) {
      setFields((fields) => {
        const oldIndex = fields.findIndex((field) => field.id === active.id);
        const newIndex = fields.findIndex((field) => field.id === over?.id);
        console.log(oldIndex, newIndex);
        return arrayMove(fields, oldIndex, newIndex);
      });
    }
  };

  useEffect(() => {
    console.log(fields);
  }, [fields]);

  return (
    <main className="flex min-h-screen justify-start bg-gradient-to-b from-[#333] to-[#04050a]">
      {/* <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 "></div> */}
      <div className="m-12 flex w-1/4 flex-col text-gray-200">
        <div className="mb-6 border p-4 shadow-xl">
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            My field
          </label>
          <input
            placeholder="Text field"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          />
        </div>
        <div className="mb-6 border p-4 shadow-xl">
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Large input
          </label>
          <input
            type="text"
            placeholder="Large text field"
            className="sm:text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex w-full justify-center">
        <div className="flex w-1/4 flex-col justify-center">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              strategy={verticalListSortingStrategy}
              items={fields}
            >
              {fields?.map((field) => {
                return (
                  <SortableItem key={field.id} id={field.id} field={field} />
                  // switch (field.type) {
                  //   case "text":
                  //     return (
                  //       <div key={field.id} className="flex flex-col p-2">
                  //         <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  //           {field.name}
                  //         </label>
                  //         <input
                  //           key={field.id}
                  //           placeholder={field.name}
                  //           className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  //         />
                  //       </div>
                  //     );
                  // }
                );
              })}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </main>
  );
};

export default FormContainer;
