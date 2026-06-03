import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/SISCOP-AUTH';
import { loginRequest } from '../../services/auth';
import { ApiError } from '../../services/api';
import logoSiscop from '../../assets/imagotipo.svg';

interface LoginFormData {
    usuario: string;
    contrasena: string;
}

export default function SiscopLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorBackend, setErrorBackend] = useState<string | null>(null);

    const onSubmit = async (data: LoginFormData) => {
        setErrorBackend(null);
        setLoading(true);
        try {
            const identificador = data.usuario.trim();
            const usuarioAutenticado = await loginRequest(identificador, data.contrasena);
            login({
                nombre: usuarioAutenticado.nombre,
                apellidos: usuarioAutenticado.apellidos,
                rol: usuarioAutenticado.rol,
            });
            navigate(`/${usuarioAutenticado.rol.toLowerCase()}/dashboard`);
        } catch (err) {
            if (err instanceof ApiError) {
                setErrorBackend(err.message);
            } else {
                setErrorBackend('No se pudo conectar con el servidor. Verifique que el backend esté activo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-[#e0f7fa] to-[#dcfce7] p-6">
            <div className="flex flex-row items-center justify-center gap-20 max-w-262.5 w-full flex-wrap">

                <div className="flex flex-col items-start min-w-[320px]">
                    <img
                        src={logoSiscop}
                        alt="Logo SISCOP"
                        className="w-90 h-auto block mb-5"
                    />
                    <div className="border-l-[5px] border-siscop-verde pl-5 text-slate-600 text-[1.1rem] leading-relaxed font-medium">
                        Plataforma integral para el control y<br />
                        seguimiento del peso de pacientes
                    </div>
                </div>

                <div className="bg-white p-10 rounded-3xl shadow-[0_20px_40px_rgba(26,130,196,0.15)] w-full max-w-105 border border-slate-100">

                    <h2 className="text-[1.75rem] font-semibold mb-1 text-slate-900 tracking-tight">
                        Iniciar Sesión
                    </h2>
                    <p className="text-slate-400 mb-8 text-[0.95rem]">
                        Accede a tu cuenta
                    </p>

                    {errorBackend && (
                        <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                            {errorBackend}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        <div className={`floating-container ${errors.usuario ? 'has-error' : ''}`}>
                            <input
                                type="text"
                                placeholder=" "
                                autoComplete="username"
                                className={`floating-input w-full pt-6 pb-2 px-3.5 text-[1rem] border rounded-2xl outline-none transition-all bg-transparent
                            ${errors.usuario
                                    ? 'border-red-500 focus:border-red-500 bg-red-50/10'
                                    : 'border-slate-200 focus:border-siscop-azul focus:ring-4 focus:ring-blue-500/10'}`}
                                {...register('usuario', { required: 'El campo usuario es obligatorio.' })}
                            />
                            <label className="floating-label absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-all text-[1rem]">
                                Usuario
                            </label>

                            {errors.usuario && (
                                <span className="text-red-500 text-[0.78rem] absolute -bottom-5 left-1 font-medium">
                            {errors.usuario.message}
                                </span>
                            )}
                        </div>

                        <div className={`floating-container ${errors.contrasena ? 'has-error' : ''} mt-8!`}>
                            <input
                                type={mostrarPassword ? "text" : "password"}
                                placeholder=" "
                                autoComplete="current-password"
                                className={`floating-input w-full pt-6 pb-2 pl-3.5 pr-11 text-[1rem] border rounded-2xl outline-none transition-all bg-transparent
                        ${errors.contrasena
                                    ? 'border-red-500 focus:border-red-500 bg-red-50/10'
                                    : 'border-slate-200 focus:border-siscop-azul focus:ring-4 focus:ring-blue-500/10'}`}
                                {...register('contrasena', { required: 'La contraseña es obligatoria.' })}
                            />
                            <label className="floating-label absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-all text-[1rem]">
                                Contraseña
                            </label>

                            <button
                                type="button"
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 flex items-center justify-center bg-transparent border-none cursor-pointer transition-colors"
                                onClick={() => setMostrarPassword(!mostrarPassword)}
                            >
                                {mostrarPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                            </button>

                            {errors.contrasena && (
                                <span className="text-red-500 text-[0.78rem] absolute -bottom-5 left-1 font-medium">
                            {errors.contrasena.message}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-siscop-azul text-white font-semibold rounded-2xl text-[1rem] cursor-pointer hover:bg-[#156fa9] active:scale-[0.98] transition-all shadow-[0_6px_20px_rgba(26,130,196,0.25)] mt-10! flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
