export default function TaskSkeleton() {
  return (
    <div className="p-3 border rounded shadow-sm fade-in" style={{ minHeight: 160 }}>
      <div className="skeleton mb-3" style={{ height: 22, width: "70%" }} />

      <div className="skeleton mb-2" style={{ height: 14, width: "95%" }} />
      <div className="skeleton mb-2" style={{ height: 14, width: "90%" }} />
      <div className="skeleton mb-2" style={{ height: 14, width: "60%" }} />

      <div className="d-flex justify-content-between mt-4">
        <div className="skeleton" style={{ height: 32, width: "30%" }} />
        <div className="skeleton" style={{ height: 32, width: "30%" }} />
      </div>
    </div>
  );
}
