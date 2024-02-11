import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Image } from 'react-bootstrap';
import successImage from '../../assets/img/success.gif';

export default function ModalWithImage({show, handleClose, title, message}) {
  return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>{message}</p>
            <div className='text-center'>
                <Image style={{width:'200px', height:'200px'}} src={successImage} />
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleClose}>
            Thank You!
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}