import { ChangeEvent, useContext, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { Container } from "../../../../components/container";
import { DashboardHeader } from "../../../../components/painelHeader";
import { useForm } from 'react-hook-form'
import { Input } from '../../../../components/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {AuthContext} from '../../../../contexts/AuthContext'
import {v4 as uuidV4} from 'uuid'

 import {storage} from '../../../../services/firebaseConnection'
 import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
 } from 'firebase/storage'

const schema = z.object({
    nome: z.string().nonempty("O campo nome é obrigatório"),
    numero: z.string().min(1, "O campo número é obrigatório"), 
    anoNascimento: z.string().nonempty("O campo ano de nascimento é obrigatório"), 
    sexo: z.string().nonempty("O campo sexo é obrigatório"), 
    origem: z.string().nonempty("O campo origem é obrigatório"), 
    composicao: z.string().nonempty("O campo composição é obrigatório"), 
    puroDeOrigemrigem: z.string().nonempty("O campo puro de origem é obrigatório"), 
    pesoAoNascer: z.string().nonempty("O campo peso ao nascer é obrigatório"), 
    sisBov: z.string().nonempty("O campo SIS BOV é obrigatório"), 
    pesoDoDesmame: z.string().nonempty("O campo peso do desmame é obrigatório"), 
    rgn: z.string().min(1).nonempty("O campo RGN é obrigatório"), 
    pelagem: z.string().nonempty("O campo pelagem é obrigatório"),
    observacao: z.string().nonempty("O campo observação é obrigatório") 
    
})

type FormData = z.infer<typeof schema>;

export function CadastroAnimais(){
    const {user} =  useContext(AuthContext)
    const {register, handleSubmit, formState: {errors}, reset} = useForm<FormData>({
        resolver:zodResolver(schema),
        mode:"onChange"
    })

    function onSubmit(data:FormData){
        console.log(data);
    }

    async function handleFile(e:ChangeEvent<HTMLInputElement>){
        if(e.target.files && e.target.files[0]){
            const image = e.target.files[0]
            
            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                await handleUpload(image)
            }else{
                alert("Envie uma imagem jpeg ou png!");/// adicionar o co
            }
        }
    }

    async function handleUpload(image:File) {
        if(!user?.uid){
            return;
        }

        const currentUid = user?.uid;
        const uidImage = uuidV4();

        const uploadRef = ref(storage,`images/${currentUid}/${uidImage}`)

        uploadBytes(uploadRef, image)
        .then((snapshot) => {
            getDownloadURL(snapshot.ref).then((getDownloadURL) => {
                //Continuar...
            })
        })

    }

    return(
        <div>
            <Container>
                <DashboardHeader/>
                <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
                    <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
                        <div className="absolute cursor-pointer">
                            <FiUpload size={30} color="#000"/>
                        </div>
                        <div className="cursor-pointer">
                            <input 
                            type="file" 
                            accept="image/*" 
                            className="opacity-0 cursor-pointer" 
                            onChange={handleFile} />
                        </div>
                    </button>
                </div>
                <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
                    <form className="w-full" 
                        onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex w-full mb-3 flex-row items-center gap-4">
                            <div className="w-full">
                                <p className="mb-2 font-medium">Nome do animal</p>
                                <Input
                                type="text"
                                register={register}
                                name="nome"
                                error={errors.nome?.message}
                                placeholder="Informe o nome do animal"
                                />
                            </div>
                            <div className="w-full">
                                <p className="mb-2 font-medium">Número</p>
                                <Input
                                type="text"
                                register={register}
                                name="numero"
                                error={errors.numero?.message}
                                placeholder="Informe o número do animal"
                                />
                            </div>

                            <div className="w-full">
                                <p className="mb-2 font-medium">Ano de nasc.</p>
                                <Input
                                type="text"
                                register={register}
                                name="anoNascimento"
                                error={errors.anoNascimento?.message}
                                placeholder="Informe o ano de nasc."
                                />
                            </div>
                        </div>

                        <div className="flex w-full mb-3 flex-row items-center gap-4">
                        <div className="w-full">
                                <p className="mb-2 font-medium">Sexo</p>
                                <Input
                                type="text"
                                register={register}
                                name="sexo"
                                error={errors.sexo?.message}
                                placeholder="Informe o sexo"
                                />
                            </div>

                            <div className="w-full">
                                <p className="mb-2 font-medium">origem</p>
                                <Input
                                type="text"
                                register={register}
                                name="origem"
                                error={errors.origem?.message}
                                placeholder="Informe a origem"
                                />
                            </div>
                            <div className="w-full">
                                <p className="mb-2 font-medium">Composição</p>
                                <Input
                                type="text"
                                register={register}
                                name="composicao"
                                error={errors.composicao?.message}
                                placeholder="Informe a composicao"
                                />
                            </div>
                        </div>



                        <div className="flex w-full mb-3 flex-row items-center gap-4">
                        <div className="w-full">
                                <p className="mb-2 font-medium">Puro de origem</p>
                                <Input
                                type="text"
                                register={register}
                                name="puroDeOrigemrigem"
                                error={errors.puroDeOrigemrigem?.message}
                                placeholder=""
                                />
                            </div>
                            <div className="w-full">
                                <p className="mb-2 font-medium">Peso do nascimento</p>
                                <Input
                                type="text"
                                register={register}
                                name="pesoAoNascer"
                                error={errors.pesoAoNascer?.message}
                                placeholder="Informe o peso do nascimento"
                                />
                            </div>
                            <div className="w-full">
                                <p className="mb-2 font-medium">SIS BOV</p>
                                <Input
                                type="text"
                                register={register}
                                name="sisBov"
                                error={errors.sisBov?.message}
                                placeholder="Informe o SIS BOV"
                                />
                            </div>
                        </div>

                        <div className="flex w-full mb-3 flex-row items-center gap-4">
                            <div className="w-full">
                                <p className="mb-2 font-medium">RGN</p>
                                <Input
                                type="text"
                                register={register}
                                name="rgn"
                                error={errors.rgn?.message}
                                placeholder="Informe o RGN"
                                />
                            </div>

                            <div className="w-full">
                                <p className="mb-2 font-medium">Pelagem</p>
                                <Input
                                type="text"
                                register={register}
                                name="pelagem"
                                error={errors.pelagem?.message}
                                placeholder="Informe a pelagem"
                                />
                            </div>
                            <div className="w-full">
                                <p className="mb-2 font-medium">Peso do desmame</p>
                                <Input
                                type="text"
                                register={register}
                                name="pesoDoDesmame"
                                error={errors.pesoDoDesmame?.message}
                                placeholder="Informe peso do desmame"
                                />
                            </div>

                        </div>

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
                        <button type="submit" className="w-full rounded-md bg-zinc-900 text-white font-medium h-10">
                            Cadastrar
                        </button>
                    </form>
                </div>
            </Container>
        </div>
    )
}