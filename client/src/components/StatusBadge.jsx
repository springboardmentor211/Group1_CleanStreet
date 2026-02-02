const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case "Received":
        return {
          backgroundColor: "#DBEAFE",
          color: "#1D4ED8",
        };
      case "In Review":
        return {
          backgroundColor: "#FEF3C7",
          color: "#92400E",
        };
      case "Resolved":
        return {
          backgroundColor: "#DCFCE7",
          color: "#166534",
        };
      default:
        return {
          backgroundColor: "#E5E7EB",
          color: "#374151",
        };
    }
  };

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: "600",
        ...getStyles(),
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
