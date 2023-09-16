import { Container } from "../../../../components/container";
import { DashboardHeader } from "../../../../components/painelHeader";
import {useParams} from 'react-router-dom';
import {useEffect, useState } from "react";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '../../../../components/input'
import {toast} from 'react-hot-toast'
import {addDoc, collection, getDoc, doc, updateDoc} from 'firebase/firestore'
import {db} from '../../../../services/firebaseConnection'

const schema = z.object({
    nome: z.string().nonempty("O campo nome é obrigatório"),
    confinamento: z.string().nonempty("O campo confinamento é obrigatório"),
    aptidao: z.string().nonempty("O campo a aptidão é obrigatório"),
    finalidade: z.string().nonempty("O campo a finalidade é obrigatório"),
    sistemaDeCriacao: z.string().nonempty("O campo sistema de criação é obrigatório"),
    observacao: z.string().nonempty("O campo observação é obrigatório"),
    situacao: z.string().nullable().refine((situacao) => {
        return ['0', '1'].includes(situacao == null ? "" : situacao.toLowerCase());
    }, {
       message: 'O campo situação é obrigatório.'
    }),
})

type FormData = z.infer<typeof schema>;

export function CadastroLote(){
    const {id} = useParams();
    const [dataCadastro, setDataCadastro] = useState("");
    const [situacao, setSituacao] = useState('');
    
    const {register, handleSubmit, setValue, formState: {errors}, reset} = useForm<FormData>({
        resolver:zodResolver(schema),
        mode:"onChange"
    })

    useEffect(() => {
        if(!id){return}
        
        const docRef = doc(db, "Lotes", id);
        getDoc(docRef)
        .then((snapshot) => {
                setValue("nome", snapshot.data()?.nome);
                setValue("confinamento", snapshot.data()?.confinamento);
                setValue("aptidao", snapshot.data()?.aptidao);
                setValue("finalidade", snapshot.data()?.finalidade);
                setValue("sistemaDeCriacao", snapshot.data()?.sistemaDeCriacao);
                setValue("observacao", snapshot.data()?.observacao);
                setValue("situacao", snapshot.data()?.situacao);
                setDataCadastro(snapshot.data()?.dataCadastro);
        })
      }, [])

    function onSubmit(data:FormData){
        if(id === null || id === undefined){
            incluir(data)
        }else{
            alterar(data);
        }
    }

    function incluir(data:any){
        data.dataCriacao = new Date().toString();
        addDoc(collection(db,"Lotes"), data)
        .then(() => {
            toast.success("Registro cadastrado com sucesso.");
            reset();
        }).catch(() => {
            toast.error("Ocorreu um erro, tente novamente.");
        })
    }
  
    async function alterar(data:any){
        if(!id)return
        
        data.dataCadastro = dataCadastro === undefined ? new Date() : dataCadastro.toString();
        const docRef = doc(db, "Lotes", id);
        await updateDoc(docRef,data)
        .then(() => {
            toast.success("Registro atualizado com sucesso.");
            reset();
        }).catch(() => {
            toast.error("Ocorreu um erro, tente novamente.");
        })
      }

    const handleSituacao = (event: any) => {
        setSituacao(event.target.value);
    };
    return(
        <div>
          <Container>
            <DashboardHeader />
            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
              <form className="w-full" onSubmit={handleSubmit(onSubmit)}>

                <div className="flex w-full mb-3 flex-row items-center gap-4">
                    <div className="w-full">
                        <p className="mb-2 font-medium">Nome</p>
                        <Input
                        type="text"
                        register={register}
                        name="nome"
                        error={errors.nome?.message}
                        placeholder="Informe o nome da raça"
                        />
                    </div>

                    <div className="w-full">
                        <p className="mb-2 font-medium">Confinamento</p>
                        <Input
                        type="text"
                        register={register}
                        name="confinamento"
                        error={errors.confinamento?.message}
                        placeholder="Informe o confinamento"
                        />
                    </div>

                    <div className="w-full">
                        <p className="mb-2 font-medium">Aptidão</p>
                        <Input
                        type="text"
                        register={register}
                        name="aptidao"
                        error={errors.aptidao?.message}
                        placeholder="Informe a aptidao"
                        />
                    </div>
                </div>

                <div className="flex w-full mb-3 flex-row items-center gap-4">
                    <div className="w-full">
                        <p className="mb-2 font-medium">Finalidade</p>
                        <Input
                        type="text"
                        register={register}
                        name="finalidade"
                        error={errors.finalidade?.message}
                        placeholder="Informe a finalidade"
                        />
                    </div>
                    <div className="w-full">
                        <p className="mb-2 font-medium">Sistema de criação</p>
                        <Input
                        type="text"
                        register={register}
                        name="sistemaDeCriacao"
                        error={errors.sistemaDeCriacao?.message}
                        placeholder="Informe o sistema"
                        />
                    </div>
                    <div className="w-full">
                        <p className="font-medium">Situação</p>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                {...register("situacao")}
                                name="situacao"
                                id="situacao1"
                                value="1"
                                checked={situacao === '1'}
                                onChange={handleSituacao}
                            />
                            <span className="ml-2">Ativo</span>
                        </label>
                        {' '}
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                {...register("situacao")}
                                name="situacao"
                                id="situacao2"
                                value="0"
                                checked={situacao === '0'}
                                onChange={handleSituacao}
                            />
                            <span className="ml-2">Inativo</span>
                        </label>
                        {errors.situacao && <p className="mb-1 text-red-500">{errors.situacao?.message}</p>} 
                    </div> 
                </div>
                <div className="w-full mb-3 flex-row items-center gap-4">
                    <div className="mb-3">
                            <p className="mb-2 font-medium">Observação</p>
                            <textarea 
                                className="border-2 w-full rounded-md h-24 px-2"
                                {... register("observacao")}
                                name="observacao"
                                id="observacao"
                                placeholder="Digite a observação"
                            />
                           {errors.observacao && <p className="mb-1 text-red-500">{errors.observacao.message}</p>} 
                        </div>
                    </div>
                <button
                  type="submit"
                  className="w-full flex-auto rounded-md bg-blue-500 text-white font-medium h-10"
                >
                  Cadastrar
                </button>
              </form>
            </div>
          </Container>
        </div>
    )
}