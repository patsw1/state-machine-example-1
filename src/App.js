import { Button } from "antd";
import Modal from "antd/lib/modal/Modal";
import { useCallback, useEffect, useState } from "react";
import Details from "./Details";

import "antd/dist/antd.css";

import styles from "./styles.module.css";

const initialOrderData = { item: "", quantity: 0 };

export default function App() {
  const [orderData, setOrderData] = useState(initialOrderData);
  const [replaceOrder, setReplaceOrder] = useState(false);
  const [changeRequested, setChangeRequested] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [replaceConfirmed, setReplaceConfirmed] = useState(false);
  const [updateComplete, setUpdateComplete] = useState(false);

  // from Will Replace to Won't Replace and vice versa, click "Replace" checkbox
  const onClick = () => {
    setReplaceOrder((priorValue) => !priorValue);
  };

  // from Will/Won't Replace, click "Update Order"
  const onSubmitOrder = (newOrderData) => {
    setChangeRequested(true);
    setOrderData(newOrderData);
  };

  // Click "OK" from Request Confirmation
  const onOK = () => {
    setReplaceConfirmed(true);
  };

  // Click "Cancel" from Request Confirmation
  const onCancel = () => {
    setChangeRequested(false);
    setShowConfirmation(false);
  };

  const doServerStuff = useCallback(async (data, replace) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("sent to server", { data, replace });
  }, []);

  // Transition from Updating/Replacing to Complete
  const updateOrder = useCallback(
    async (orderData, replaceOrder) => {
      await doServerStuff(orderData, replaceOrder);
      setUpdateComplete(true);
    },
    [doServerStuff]
  );

  // from Will/Won't Replace to Updating, Replacing or Request Confirmation
  useEffect(() => {
    if (!changeRequested) {
      return;
    }
    if (replaceOrder && !replaceConfirmed) {
      // We don't have to check showConfirmation. This won't cause an infinite render loop.
      setShowConfirmation(true);
      return;
    }
    updateOrder(orderData, replaceOrder);
  }, [changeRequested, orderData, replaceConfirmed, replaceOrder, updateOrder]);

  // from Complete to Won't Replace
  useEffect(() => {
    if (updateComplete) {
      setChangeRequested(false);
      setReplaceOrder(false);
      setShowConfirmation(false);
      setReplaceConfirmed(false);
      setOrderData({ ...initialOrderData });
      setTimeout(() => {
        setUpdateComplete(false);
      }, 5000);
    }
  }, [updateComplete]);

  return (
    <div className={styles.main}>
      <Details
        initialValues={orderData}
        onSubmit={onSubmitOrder}
        replace={replaceOrder}
        onReplaceClick={onClick}
      />
      <Button
        type="primary"
        loading={changeRequested}
        disabled={changeRequested}
        onClick={() => setChangeRequested(true)}
      >
        Update Order
      </Button>
      {updateComplete && (
        <span className={styles.confirmation}>Order updated</span>
      )}
      <Modal
        title="Replace Order"
        visible={showConfirmation}
        onOk={onOK}
        okButtonProps={{
          loading: replaceConfirmed,
          disabled: replaceConfirmed
        }}
        onCancel={onCancel}
      >
        Are you sure you want to replace your entire order?
      </Modal>
    </div>
  );
}
