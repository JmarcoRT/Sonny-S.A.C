interface PacientePaginacionProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Paginacion({
    currentPage,
    totalPages,
    onPageChange
}: PacientePaginacionProps) {
    const renderPageNumbers = () => {
        const pages = [];

        for (let i = 1; i <= Math.min(3, totalPages); i++) {
            pages.push(i);
        }

        if (totalPages > 5) {
            if (currentPage > 3 && currentPage < totalPages - 2) {
                pages.push('...');
                pages.push(currentPage);
                pages.push('...');
            } else {
                pages.push('...');
            }

            for (let i = totalPages - 1; i <= totalPages; i++) {
                if (i > 3) {
                    pages.push(i);
                }
            }
        } else {
            for (let i = 4; i <= totalPages; i++) {
                pages.push(i);
            }
        }

        return pages.map((page, index) => {
            if (page === '...') {
                return (
                    <span key={`ellipses-${index}`} className="px-2 text-slate-400">
                        ...
                    </span>
                );
            }

            const pageNum = page as number;
            const isSelected = pageNum === currentPage;

            return (
                <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all cursor-pointer ${isSelected
                            ? 'bg-slate-800 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                >
                    {pageNum}
                </button>
            );
        });
    };

    return (
        <div className="flex justify-center items-center gap-4 mt-6 text-sm text-slate-500 font-medium">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-500`}
            >
                Anterior
            </button>

            <div className="flex items-center gap-1">
                {renderPageNumbers()}
            </div>

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-500`}
            >
                Siguiente
            </button>
        </div>
    );
}
