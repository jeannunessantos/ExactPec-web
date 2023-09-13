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

export function CadastroEmpresa(){

    const {id} = useParams();
    const [dataCadastro, setDataCadastro] = useState("");
    const [situacao, setSituacao] = useState('');
    const [tipoDocumento, setTipoDeDocumento] = useState('');

    const schema = z.object({
        nome: z.string().nonempty("O campo nome é obrigatório"),
        inscricaoMunicipal: z.string().nonempty("O campo inscrição municipal é obrigatório"),
        inscricaoEstadual: z.string().nonempty("O campo inscrição estadual é obrigatório"),
        telefone: z.string().nonempty("O campo telefone é obrigatório"),
        email: z.string().nonempty("O campo email é obrigatório"),
        documento: z.string().nonempty("O campo documento é obrigatório"),
        responsavel: z.string().nonempty("O campo responsável é obrigatório"),
        situacao: z.string().nullable().refine((situacao) => {
            return ['0', '1'].includes(situacao == null ? "" : situacao.toLowerCase());
        }, {
           message: 'O campo situação é obrigatório.'
        }),
        tipoDocumento: z.string().nullable().refine((tipoDocumento) => {
            return ['1', '2', '3'].includes(tipoDocumento == null ? "" : tipoDocumento.toLowerCase());
        }, {
           message: 'O campo tipo de documento é obrigatório.'
        })
    })

    const {register, handleSubmit, setValue, formState: {errors}, reset} = useForm<FormData>({
        resolver:zodResolver(schema),
        mode:"onChange"
    })

    useEffect(() => {
      if(!id){return}
      
      const docRef = doc(db, "Empresas", id);
      getDoc(docRef)
      .then((snapshot) => {
              setValue("nome", snapshot.data()?.nome);
              setValue("situacao", snapshot.data()?.situacao);
              setValue("documento",snapshot.data()?.documento);
              setValue("tipoDocumento",snapshot.data()?.tipoDocumento);
              setValue("inscricaoMunicipal",snapshot.data()?.inscricaoMunicipal);
              setValue("inscricaoEstadual",snapshot.data()?.inscricaoEstadual);
              setValue("responsavel",snapshot.data()?.responsavel);
              setValue("telefone",snapshot.data()?.telefone);
              setValue("email",snapshot.data()?.email);

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
        data.dataCriacao = new Date();
        addDoc(collection(db,"Empresas"), data)
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
        const docRef = doc(db, "Empresas", id);
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

      const handleTipoDocumento = (event: any) => {
        setTipoDeDocumento(event.target.value);
      };

    return(
        <div>
          <Container>
            <DashboardHeader />
            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
              <form className="w-full" onSubmit={handleSubmit(onSubmit)}>

                <div className="flex w-full mb-3 flex-row items-center gap-4">
                    <div className="w-full">
                        <p className="mb-2 font-medium">Nome da empresa</p>
                        <Input
                        type="text"
                        register={register}
                        name="nome"
                        error={errors.nome?.message}
                        placeholder="Informe o nome da empresa"
                        />
                    </div>
                    <div className="w-full">
                        <p className="mb-2 font-medium">Documento</p>
                        <Input
                        type="text"
                        register={register}
                        name="documento"
                        error={errors.documento?.message}
                        placeholder="Informe o documento municipal"
                        />
                    </div>

                    <div className="w-1/3">
                    <p className="mb-2 font-medium">Tipo de documento</p>
                    <select
                      className="appearance-none bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                      {...register("tipoDocumento")}
                      name="tipoDocumento"
                      value={tipoDocumento}
                      onChange={handleTipoDocumento}
                    >
                      <option value="">Informe o tipo de documento</option>
                      <option value="1">CPF</option>
                      <option value="2">CNPJ</option>
                    </select>
                    {errors.tipoDocumento && <p className="mb-1 text-red-500">{errors.tipoDocumento?.message}</p>} 
                  </div>
                  </div>

                  <div className="flex w-full mb-3 flex-row items-center gap-4">
                    <div className="w-full">
                        <p className="mb-2 font-medium">Responsável</p>
                        <Input
                        type="text"
                        register={register}
                        name="responsavel"
                        error={errors.responsavel?.message}
                        placeholder="Informe o responsável"
                        />
                    </div>
                    <div className="w-full">
                            <p className="mb-2 font-medium">E-mail</p>
                            <Input
                            type="text"
                            register={register}
                            name="email"
                            error={errors.email?.message}
                            placeholder="Informe o e-mail"
                            />
                    </div>
                    <div className="w-full">
                            <p className="mb-2 font-medium">Telefone</p>
                            <Input
                            type="text"
                            register={register}
                            name="telefone"
                            error={errors.telefone?.message}
                            placeholder="Informe o telefone"
                            />
                    </div>
                  </div>

                <div className="flex w-full mb-3 flex-row items-center gap-4">
                <div className="w-full">
                        <p className="mb-2 font-medium">Inscrição municípal</p>
                        <Input
                        type="text"
                        register={register}
                        name="inscricaoMunicipal"
                        error={errors.inscricaoMunicipal?.message}
                        placeholder="Informe a inscrição municipal"
                        />
                    </div>
                    <div className="w-full">
                        <p className="mb-2 font-medium">Inscrição estadual</p>
                        <Input
                        type="text"
                        register={register}
                        name="inscricaoEstadual"
                        error={errors.inscricaoEstadual?.message}
                        placeholder="Informe a inscrição estadual"
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