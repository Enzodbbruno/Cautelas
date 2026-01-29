'use client';

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="btn btn-primary"
        >
            Imprimir Agora (Ctrl+P)
        </button>
    );
}
