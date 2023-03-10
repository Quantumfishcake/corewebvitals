
import { useState } from 'react';


const Modal: React.FC<{ title: React.ReactNode, body: React.ReactNode, buttonText:React.ReactNode }> = ({ title, body, buttonText }) => {
    // set modal to false
    const [isOpen, setIsOpen] = useState(false);
    // return the modal
    return (
        <div id="modal">

            <label htmlFor="my-modal-3" className="btn" onClick={() => setIsOpen(true)}>{buttonText}</label>

            <input type="checkbox" id="my-modal-3" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative">
                    <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => setIsOpen(false)}>✕</label>
                    <h3 className="text-lg font-bold">{title}</h3>
                    <p className="py-4">{body}</p>
                </div>
            </div>
        </div>


    );
};

export default Modal;

