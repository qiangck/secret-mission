import { Space } from "antd";
import "./index.css";

export default function FormSubmit(props) {
  return (
    <div className="form-submit">
      {props.space ? <Space size="large">{props.children}</Space> : props.children}
    </div>
  );
}
