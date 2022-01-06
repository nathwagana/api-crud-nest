import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Model } from 'mongoose';
import { Categoria } from './interfaces/categoria.interface';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { JogadoresService } from 'src/jogadores/jogadores.service';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService) { }

  async criar(criarCategoriaDto: CriarCategoriaDto): Promise<Categoria> {
    const { categoria } = criarCategoriaDto;

    const categoriaEncontrada = await this.categoriaModel.findOne({ categoria }).exec();

    if (categoriaEncontrada) {
      throw new BadRequestException(`Categoria ${categoria} já cadastrada`);
    }

    const categoriaCriada = new this.categoriaModel(criarCategoriaDto);
    return await categoriaCriada.save();
  }

  async consultarTodasCategorias(): Promise<Categoria[]> {
    return await this.categoriaModel.find().populate("jogadores").exec();
  }

  async consultarCategoriaPorId(categoria: string): Promise<Categoria> {
    const categoriaEncontrada = await this.categoriaModel.findOne({ categoria }).populate("jogadores").exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria ${categoria} não encontrada`);
    }

    return categoriaEncontrada;
  }

  async atualizarCategoria(categoria: string, atualizarCategoriaDto: AtualizarCategoriaDto): Promise<void> {
    const categoriaEncontrada = await this.categoriaModel.findOne({ categoria }).exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria ${categoria} não encontrada`)
    }

    await this.categoriaModel.findOneAndUpdate({ categoria }, { $set: atualizarCategoriaDto }).exec();
  }

  // async 

  async deletarCategoria(categoria: string) {
    const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria ${categoria} não encontrada`);
    }

    return await this.categoriaModel.deleteOne({categoria}).exec();
  }

  async atribuitCategoriaJogador(params: string[]): Promise<void> {
    const categoria = params['categoria'];
    const idJogador = params['idJogador'];

    const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).exec();
    const jogadorJaCadastradoCategoria = await await this.categoriaModel.find({categoria}).where('jogadores').in(idJogador).exec();

    await this.jogadoresService.consultarJogadorPorId(idJogador);

    if (!categoriaEncontrada) {
      throw new BadRequestException(`Categoria ${categoria} não cadastrada`);
    }

    if (jogadorJaCadastradoCategoria.length > 0) {
      throw new BadRequestException(`Jogador ${idJogador} já cadastrado na categoria ${categoria}`);
    }

    categoriaEncontrada.jogadores.push(idJogador);
    await this.categoriaModel.findOneAndUpdate({categoria},{$set: categoriaEncontrada}).exec();
  }
}
