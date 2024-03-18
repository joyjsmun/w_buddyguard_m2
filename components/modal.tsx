import React from "react";

function Modal({
  onClickToggleModal,
  children,
}: {
  onClickToggleModal: any;
  children: any;
}) {
  return (
    <div className="fixed top-0 left-0 w-full px-4 h-full flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white   w-full p-4 flex-col justify-center items-center ">
        {children}
        <div
          className="mt-4 bg-[#0A0A0A] text-white py-4 px-2   flex justify-center items-center"
          onClick={onClickToggleModal}
        >
          <span className="text-center font-lato"> CLOSE</span>
        </div>
      </div>
    </div>
  );
}

export default Modal;
