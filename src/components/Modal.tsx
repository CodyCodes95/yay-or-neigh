import { Dialog } from "@headlessui/react";

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
  onClose?: () => void;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  children,
  setIsOpen,
  onClose = () => setIsOpen(false),
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white">
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Modal;
