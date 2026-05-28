import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './layout/Sidebar';
import { Headbar } from './layout/Headbar';

export default function SiscopLay() {
    const location = useLocation();
    const isAtencion = location.pathname.includes('/atencion');

    return (
        <div className="flex h-screen w-screen bg-slate-50 font-sans overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Headbar />
                <main className={`flex-1 ${isAtencion ? 'p-0 overflow-hidden' : 'p-8 overflow-y-auto'}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}