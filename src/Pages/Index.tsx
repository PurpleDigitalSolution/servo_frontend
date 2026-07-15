import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/auth/login");
  },[]);
  return(<div></div>)
};

export default Index;
