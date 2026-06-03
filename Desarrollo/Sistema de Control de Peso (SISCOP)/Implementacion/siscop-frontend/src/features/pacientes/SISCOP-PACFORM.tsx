import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/ui/Modal';
import CampoTexto from '../../components/ui/CampoTexto';
import Seleccion from '../../components/ui/Seleccion';
import { Button } from '../../components/ui/Boton';
import type { Paciente } from '../../mocks/mockPacientes';

interface PatientFormData {
    tipoDocumento: string;
    documento: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaNacimiento: string;
    edad: string;
    sexo: 'Femenino' | 'Masculino';
    telefono: string;
}

interface SiscopMpacProps {
    isOpen?: boolean;
    onClose?: () => void;
    onSave?: (data: PatientFormData) => void;
    patientToEdit?: Paciente | null;
}

export default function SiscopMpac({ isOpen, onClose, onSave, patientToEdit }: SiscopMpacProps) {
    const navigate = useNavigate();

    // Soportar tanto renderizado tipo Modal como ruta de página directa
    const isModal = isOpen !== undefined;
    const finalIsOpen = isModal ? isOpen : true;
    const finalOnClose = isModal ? onClose : () => navigate('/recepcionista/pacientes');

    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<PatientFormData>({
        defaultValues: {
            tipoDocumento: 'DNI',
            sexo: 'Femenino',
            edad: ''
        }
    });

    const calcularEdad = (fechaNac: string): number => {
        if (!fechaNac) return 0;
        const nacimiento = new Date(fechaNac);
        const hoy = new Date();
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad >= 0 ? edad : 0;
    };

    const fechaNacimiento = watch('fechaNacimiento');

    // Escucha la fecha de nacimiento para recalcular la edad automáticamente
    useEffect(() => {
        if (fechaNacimiento) {
            const edadCalculada = calcularEdad(fechaNacimiento);
            setValue('edad', edadCalculada.toString());
        } else {
            setValue('edad', '');
        }
    }, [fechaNacimiento, setValue]);

    // Rellena el formulario con los datos del paciente si estamos editando
    useEffect(() => {
        if (finalIsOpen) {
            if (patientToEdit) {
                // Separar apellido en paterno y materno
                const apellidos = patientToEdit.apellido.split(' ');
                const paterno = apellidos[0] || '';
                const materno = apellidos.slice(1).join(' ') || '';
                
                // Estimar fecha de nacimiento aproximada según edad
                const estimatedBirthYear = new Date().getFullYear() - patientToEdit.edad;
                const birthDateString = `${estimatedBirthYear}-01-01`;

                reset({
                    tipoDocumento: 'DNI',
                    documento: patientToEdit.documento,
                    nombre: patientToEdit.nombre,
                    apellidoPaterno: paterno,
                    apellidoMaterno: materno,
                    fechaNacimiento: birthDateString,
                    edad: patientToEdit.edad.toString(),
                    sexo: patientToEdit.sexo,
                    telefono: patientToEdit.telefono
                });
            } else {
                reset({
                    tipoDocumento: 'DNI',
                    documento: '',
                    nombre: '',
                    apellidoPaterno: '',
                    apellidoMaterno: '',
                    fechaNacimiento: '',
                    edad: '',
                    sexo: 'Femenino',
                    telefono: ''
                });
            }
        }
    }, [finalIsOpen, patientToEdit, reset]);

    const onSubmit = (data: PatientFormData) => {
        console.log('Paciente a guardar:', data);
        if (onSave) {
            onSave(data);
        } else {
            alert(`¡Operación realizada con éxito!\n\nNombre: ${data.nombre} ${data.apellidoPaterno} ${data.apellidoMaterno}\nDocumento: ${data.documento}`);
        }
        finalOnClose?.();
    };

    const handleLimpiar = () => {
        reset({
            tipoDocumento: 'DNI',
            documento: '',
            nombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            fechaNacimiento: '',
            edad: '',
            sexo: 'Femenino',
            telefono: ''
        });
    };

    const modalTitle = patientToEdit ? 'Editar Información del Paciente' : 'Formulario de Admisión';
    const modalSubtitle = patientToEdit 
        ? 'Complete los datos personales para actualizar el registro clínico' 
        : 'Complete los datos personales del nuevo paciente';
    const submitButtonText = patientToEdit ? 'Guardar Cambios' : 'Registrar Paciente';

    return (
        <Modal
            isOpen={finalIsOpen}
            onClose={finalOnClose || (() => {})}
            title={modalTitle}
            subtitle={modalSubtitle}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tipo de documento */}
                    <Seleccion
                        label="Tipo de documento *"
                        error={errors.tipoDocumento ? 'Campo requerido' : undefined}
                        options={[
                            { value: 'DNI', label: 'DNI' },
                            { value: 'Carnet de Extranjería', label: 'Carnet de Extranjería' }
                        ]}
                        {...register('tipoDocumento', { required: true })}
                    />

                    {/* N° de documento */}
                    <CampoTexto
                        label="N° de documento *"
                        placeholder="N° de documento"
                        error={errors.documento?.message}
                        {...register('documento', { 
                            required: 'El número de documento es obligatorio.',
                            pattern: {
                                value: /^\d+$/,
                                message: 'El documento debe contener solo números.'
                            }
                        })}
                    />

                    {/* Nombres */}
                    <CampoTexto
                        label="Nombres *"
                        placeholder="Nombres"
                        error={errors.nombre?.message}
                        {...register('nombre', { required: 'El nombre es obligatorio.' })}
                    />

                    {/* Apellidos */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">Apellidos *</label>
                        <div className="grid grid-cols-2 gap-4">
                            <CampoTexto
                                placeholder="Paterno"
                                error={errors.apellidoPaterno?.message}
                                {...register('apellidoPaterno', { required: 'Apellido paterno obligatorio.' })}
                            />
                            <CampoTexto
                                placeholder="Materno"
                                error={errors.apellidoMaterno?.message}
                                {...register('apellidoMaterno', { required: 'Apellido materno obligatorio.' })}
                            />
                        </div>
                    </div>

                    {/* Fecha de nacimiento */}
                    <CampoTexto
                        label="Fecha de nacimiento*"
                        type="date"
                        error={errors.fechaNacimiento?.message}
                        {...register('fechaNacimiento', { required: 'La fecha de nacimiento es obligatoria.' })}
                    />

                    {/* Edad */}
                    <CampoTexto
                        label="Edad *"
                        readOnly
                        placeholder="Edad"
                        className="bg-slate-100 border border-slate-200 text-slate-500 select-none cursor-not-allowed"
                        {...register('edad')}
                    />

                    {/* Sexo */}
                    <Seleccion
                        label="Sexo *"
                        options={[
                            { value: 'Femenino', label: 'Femenino' },
                            { value: 'Masculino', label: 'Masculino' }
                        ]}
                        {...register('sexo', { required: true })}
                    />

                    {/* Teléfono */}
                    <CampoTexto
                        label="Teléfono *"
                        placeholder="Teléfono"
                        error={errors.telefono?.message}
                        {...register('telefono', { 
                            required: 'El teléfono es obligatorio.',
                            pattern: {
                                value: /^\+?\d{9,15}$/,
                                message: 'Ingrese un número de teléfono válido.'
                            }
                        })}
                    />
                </div>

                {/* Botones */}
                <div className="flex gap-4 pt-4 border-t border-slate-100">
                    <Button type="submit" variant="primary">
                        {submitButtonText}
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleLimpiar}>
                        Limpiar
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
