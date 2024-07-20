import React, { createContext, useState, useContext } from 'react';

// 创建 ModalContext
const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log("isModalOpen",isModalOpen)
  return (
    <ModalContext.Provider value={{ isModalOpen, setIsModalOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

// 自定义钩子，方便使用 ModalContext
export const useModal = () => {
  return useContext(ModalContext);
};
