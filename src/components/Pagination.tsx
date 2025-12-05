'use client';

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, limit, total, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  // Generate page numbers with smart truncation
  const getPages = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 4) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1); // Always show 1

      if (page > 3) pages.push("...");

      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) pages.push("...");

      pages.push(totalPages); // Always show last
    }

    return pages;
  };

  const pages = getPages();

  return (
    <div className="d-flex justify-content-center mt-4">
      <nav>
        <ul className="pagination">

          {/* Prev */}
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(page - 1)}>
              Prev
            </button>
          </li>

          {/* Page Numbers */}
          {pages.map((p, idx) =>
            p === "..." ? (
              <li key={idx} className="page-item disabled">
                <span className="page-link">…</span>
              </li>
            ) : (
              <li key={idx} className={`page-item ${p === page ? "active" : ""}`}>
                <button className="page-link" onClick={() => onPageChange(p as number)}>
                  {p}
                </button>
              </li>
            )
          )}

          {/* Next */}
          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(page + 1)}>
              Next
            </button>
          </li>

        </ul>
      </nav>
    </div>
  );
}
