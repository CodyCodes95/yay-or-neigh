import type { Field } from "@prisma/client";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { AiFillEdit } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
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
import Spacer from "~/components/Spacer";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type TemporaryField = {
  id: string;
  name: string;
  type: string;
  required: boolean;
  order: number;
};

type SortableItemProps = {
  id: string;
  field: TemporaryField;
  setFields: React.Dispatch<React.SetStateAction<TemporaryField[]>>;
};

const getTempId = () => Math.random().toString(36).substr(2, 9);

export const SortableItem: React.FC<SortableItemProps> = ({
  id,
  setFields,
  field,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [editMode, setEditMode] = useState("");
  const [temporaryField, setTemporaryField] = useState<TemporaryField>(field);

  switch (field.type) {
    case "text":
      return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
          <div key={field.id} className="flex flex-col p-2">
            <div className="flex w-full items-center justify-between">
              {editMode === field.id ? (
                <>
                  <div className="flex flex-col">
                    <input
                      className="my-2 rounded-lg border border-gray-300 bg-gray-50 p-1 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      type="text"
                      value={temporaryField.name}
                      onChange={(e) => {
                        setTemporaryField((prev) => {
                          return {
                            ...prev,
                            name: e.target.value,
                          };
                        });
                      }}
                    />
                    <label className="relative mr-5 inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={temporaryField.required}
                        onChange={(e) => {
                          setTemporaryField((prev) => {
                            return {
                              ...prev,
                              required: e.target.checked,
                            };
                          });
                        }}
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-red-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-red-800"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Required field
                      </span>
                    </label>
                  </div>
                  <div className="mb-2 flex">
                    <button
                      onMouseDown={() => {
                        setFields((prev: TemporaryField[]) => {
                          return prev.map((f) => {
                            if (f.id === field.id) {
                              return temporaryField;
                            }
                            return f;
                          });
                        });
                        setEditMode("");
                      }}
                      className="rounded-lg border border-gray-800 px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
                    >
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    {field.name}
                    {field.required ? "*" : ""}
                  </label>
                  <div className="flex">
                    <AiFillEdit
                      onMouseDown={() => {
                        setEditMode(field.id);
                      }}
                      className="text-white"
                    />
                    <Spacer amount={1} />
                    <RxCross1
                      onMouseDown={() => {
                        console.log("clicked");
                        setFields((prev: TemporaryField[]) => {
                          return prev
                            .filter((f) => f.id !== field.id)
                            .map((field, i) => {
                              return {
                                ...field,
                                order: i,
                              };
                            });
                        });
                      }}
                      className="text-red-600"
                    />
                  </div>
                </>
              )}
            </div>
            <input
              key={field.id}
              placeholder={field.name}
              className="my-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              type={field.type}
            />
          </div>
        </div>
      );

    case "textarea":
      return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
          <div key={field.id} className="flex flex-col p-2">
            <div className="flex w-full items-center justify-between">
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                {field.name}
              </label>
              <div className="flex">
                <AiFillEdit
                  onMouseDown={() => console.log("CLICKED")}
                  className="text-white"
                />
                <Spacer amount={1} />
                <RxCross1
                  onMouseDown={() => {
                    console.log("clicked");
                    setFields((prev: TemporaryField[]) => {
                      return prev.filter((f) => f.id !== field.id);
                    });
                  }}
                  className="text-red-600"
                />
              </div>
            </div>
            <input
              key={field.id}
              placeholder={field.name}
              type={field.type}
              className="block h-20 w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
        </div>
      );
  }

  return <div></div>;
};

const FormContainer: NextPage = () => {
  const router = useRouter();
  const { formId } = router.query;
  const [fieldsParent] = useAutoAnimate();
  const form = api.form.getForm.useQuery(
    { formId: formId as string },
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setFields(data?.fields as Field[]);
      },
      enabled: !!formId,
    }
  );

  const createFields = api.fields.createFields.useMutation();
  const updateField = api.fields.updateField.useMutation();
  const deleteField = api.fields.deleteField.useMutation();

  const [fields, setFields] = useState<TemporaryField[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    })
    // useSensor(KeyboardSensor, {
    //     coordinateGetter: sortableKeyboardCoordinates,

    // })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    console.log("TEST");
    const { active, over } = e;

    if (over?.id && active.id !== over.id) {
      setFields((fields) => {
        const oldIndex = fields.findIndex((field) => field.id === active.id);
        const newIndex = fields.findIndex((field) => field.id === over?.id);
        return arrayMove(fields, oldIndex, newIndex).map((field, i) => {
          return {
            ...field,
            order: i,
          };
        });
      });
    }
  };

  const onSave = async () => {
    const newFields = fields.filter((field) => field.id.length < 25);
    const oldFields = fields.filter((field) => field.id.length === 25);
    const deletedFields = form.data?.fields.filter(
      (field) => !fields.map((f) => f.id).includes(field.id)
    );
    if (deletedFields?.length) {
      await Promise.all(
        deletedFields.map(async (field) => {
          await deleteField.mutateAsync({
            fieldId: field.id,
          });
        })
      );
    }
    if (oldFields.length) {
      await Promise.all(
        oldFields.map(async (field) => {
          await updateField.mutateAsync({
            fieldId: field.id,
            name: field.name,
            type: field.type,
            required: field.required,
            order: field.order,
          });
        })
      );
    }
    if (newFields.length) {
      await createFields.mutateAsync({
        fields: newFields,
        formId: formId as string,
      });
    }
    form.refetch();
  };

  useEffect(() => {
    console.log(fields);
  }, [fields]);

  return (
    <main className="flex min-h-screen justify-start bg-gradient-to-b from-[#333] to-[#04050a]">
      {/* <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 "></div> */}
      <div className="m-12 flex w-1/4 flex-col text-gray-200">
        <div className="flex w-full items-center">
          <div className="mb-6 w-full border p-4 shadow-xl">
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              My field
            </label>
            <input
              placeholder="Text field"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => {
              setFields([
                ...fields,
                {
                  id: getTempId(),
                  name: "My field",
                  type: "text",
                  required: false,
                  order: fields.length,
                },
              ]);
            }}
            className="ml-2 rounded-lg border border-gray-800 px-2 py-1 text-center text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
          >
            +
          </button>
        </div>
        <div className="flex w-full items-center">
          <div className="mb-6 h-full w-full border p-4 shadow-xl">
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Large input
            </label>
            <input
              type="text"
              placeholder="Large text field"
              className="sm:text-md block w-full rounded-lg border border-gray-300 bg-gray-50 px-2 py-10 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => {
              setFields([
                ...fields,
                {
                  id: getTempId(),
                  name: "My large field",
                  type: "textarea",
                  required: false,
                  order: fields.length,
                },
              ]);
            }}
            className="ml-2 rounded-lg border border-gray-800 px-2 py-1 text-center text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex w-full justify-center">
        <div ref={fieldsParent} className="flex w-1/4 flex-col justify-center">
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
                  <SortableItem
                    setFields={setFields}
                    key={field.id}
                    id={field.id}
                    field={field}
                  />
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
          <div className="mt-2 flex items-center justify-center">
            <button
              onClick={onSave}
              className="rounded-lg border border-gray-800 px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FormContainer;
