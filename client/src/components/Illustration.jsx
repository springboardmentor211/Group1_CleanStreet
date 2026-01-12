import landing from "../assets/illustrations/landing.png";
import buildings from "../assets/illustrations/buildings.jpg";

export default function Illustration({ useBuildings = false }) {
  return (
    <div className="auth-illustration">
      <img src={useBuildings ? buildings : landing} alt="illustration" />
    </div>
  );
}
