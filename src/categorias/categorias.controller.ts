import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Put, UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CategoriasService } from './categorias.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';
import { Express } from 'express';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) { }

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(
    @Body() criarCategoriaDto: CriarCategoriaDto): Promise<Categoria> {
    return await this.categoriasService.criar(criarCategoriaDto);
  }

  @Get()
  async consultarCategorias(): Promise<Categoria[]> {
    return await this.categoriasService.consultarTodasCategorias();
  }

  @Get('/:categoria')
  async consultarCategoriaPeloId(
    @Param('categoria') categoria: string): Promise<Categoria> {
    return await this.categoriasService.consultarCategoriaPorId(categoria);
  }

  @Put('/:categoria')
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Param('categoria') categoria: string,
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto): Promise<void> {
    await this.categoriasService.atualizarCategoria(categoria, atualizarCategoriaDto);
  }

  @Delete('/:categoria')
  deletarCategoria(
    @Param('categoria') categoria: string): Promise<any> {
    return this.categoriasService.deletarCategoria(categoria);
  }

  @Post('/:categoria/jogadores/:idJogador')
  async atribuirCategoriaJogador(
    @Param() params: string[]): Promise<void> {
    return this.categoriasService.atribuitCategoriaJogador(params);
  }
}
