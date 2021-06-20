import { useEffect } from "react";
import { Checkbox, Form, Input, InputNumber } from "antd";

function Details({ onSubmit, initialValues, replace, onReplaceClick }) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields();
  }, [form, initialValues]);

  return (
    <div>
      <Form form={form} onFinish={onSubmit} initialValues={initialValues}>
        <Form.Item name="item" label="Order Item">
          <Input />
        </Form.Item>
        <Form.Item name="quantity" label="Order Quantity">
          <InputNumber />
        </Form.Item>
      </Form>
      <Checkbox checked={replace} onChange={onReplaceClick}>
        Replace entire order
      </Checkbox>
    </div>
  );
}

export default Details;
