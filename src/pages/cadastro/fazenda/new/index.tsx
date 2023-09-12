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

export function CadastroFazenda(){

    const {id} = useParams();
    const [dataCadastro, setDataCadastro] = useState("");
    const [situacao, setSituacao] = useState('');
    const [tipoDeControleDoAnimal, setTipoDeControleDoAnimal] = useState('');

    const schema = z.object({
        nome: z.string().nonempty("O campo nome é obrigatório"),
        situacao: z.string().nullable().refine((situacao) => {
            return ['0', '1'].includes(situacao == null ? "" : situacao.toLowerCase());
        }, {
           message: 'O campo situação é obrigatório.'
        }),

        tipoDeControleDoAnimal: z.string().nullable().refine((tipoDeControleDoAnimal) => {
            return ['1', '2', '3'].includes(tipoDeControleDoAnimal == null ? "" : tipoDeControleDoAnimal.toLowerCase());
        }, {
           message: 'O campo tipo de controle é obrigatório.'
        })
    })

    const {register, handleSubmit, setValue, formState: {errors}, reset} = useForm<FormData>({
        resolver:zodResolver(schema),
        mode:"onChange"
    })


    useEffect(() => {
      if(!id){return}
      
      const docRef = doc(db, "Fazendas", id);
      getDoc(docRef)
      .then((snapshot) => {
              setValue("nome", snapshot.data()?.nome);
              setValue("tipoDeControleDoAnimal",snapshot.data()?.tipoDeControleDoAnimal);
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
      data.dataCriacao = new Date();
      addDoc(collection(db,"Fazendas"), data)
      .then(() => {
          toast.success("Registro cadastrado com sucesso.");
          reset();
      }).catch(() => {
          toast.error("Ocorreu um erro, tente novamente.");
      })
    }

    async function alterar(data:any){
      if(!id)return
      
      data.dataCadastro = dataCadastro;

      const docRef = doc(db, "Fazendas", id);
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

      const handleipoDeControleDoAnimal = (event: any) => {
        setTipoDeControleDoAnimal(event.target.value);
      };

      
    return(
        <div>
          <Container>
            <DashboardHeader />
            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
              <form className="w-full" onSubmit={handleSubmit(onSubmit)}>

                <div className="flex w-full mb-3 flex-row items-center gap-4">
                  <div className="w-full">
                    <p className="mb-2 font-medium">Nome do animal</p>
                    <Input
                      type="text"
                      register={register}
                      name="nome"
                      error={errors.nome?.message}
                      placeholder="Informe o nome da fazenda"
                    />
                  </div>

                  <div className="w-1/3">
                    <p className="mb-2 font-medium">Tipo de controle</p>
                    <select
                      className="appearance-none bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                      {...register("tipoDeControleDoAnimal")}
                      name="tipoDeControleDoAnimal"
                      value={tipoDeControleDoAnimal}
                      onChange={handleipoDeControleDoAnimal}
                    >
                      <option value="">Informe o tipo de controle</option>
                      <option value="1">Brinco/Número</option>
                      <option value="2">Brinco</option>
                      <option value="3">Número</option>
                    </select>
                    {errors.tipoDeControleDoAnimal && <p className="mb-1 text-red-500">{errors.tipoDeControleDoAnimal?.message}</p>} 
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