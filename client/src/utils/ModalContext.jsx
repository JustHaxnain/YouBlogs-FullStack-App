import { createContext, useState, useContext, useEffect, useRef } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
    const [modal, setModal] = useState(null);
    const modalRef = useRef();
    function showModal({ message, onConfirm }) {
        setModal({ message, onConfirm });
    }
    function hideModal() {
        setModal(null);
    }
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === "Escape") hideModal();
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
    function handleOverlayClick(e) {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            hideModal();
        }
    }
    return (
        <ModalContext.Provider value={{ showModal }}>
            {children}
            {modal && (
                <div className="modalOverlay" onMouseDown={handleOverlayClick}>
                    <div className="modalBox" ref={modalRef}>
                        <p className="modalMessage">{modal.message}</p>
                        <div className="modalBtnGroup">
                            <button
                                className="modalConfirmBtn"
                                onClick={() => modal.onConfirm(hideModal)}
                            >
                                Yes
                            </button>
                            <button
                                className="modalCancelBtn"
                                onClick={hideModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
}

export function useModal() {
    return useContext(ModalContext);
}
