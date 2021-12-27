import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://linkapi:linkapi123@cluster0.yl1aa.mongodb.net/smartranking?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true } ),
    JogadoresModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
