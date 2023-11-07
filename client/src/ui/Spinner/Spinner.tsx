import { memo } from "react";
import "./styles.css";

type Props = {
  styles?: Record<string, string | number>;
}

const Spinner: React.FC<Props> = ({styles}) => <div style={{...styles}} className="circle-loader" />;

export default memo(Spinner);
