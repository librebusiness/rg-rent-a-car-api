import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { BusinessProfileService } from './business-profile.service';
import { CreateBusinessProfileDto } from './dto/create-business-profile.dto';
import { UpdateBusinessProfileDto } from './dto/update-business-profile.dto';
import { Request } from 'express';
import { Public } from '../auth/public.metadata';

@Controller('business-profile')
export class BusinessProfileController {
  constructor(private readonly businessProfileService: BusinessProfileService) {}

  @Post()
  create(@Body() createBusinessProfileDto: CreateBusinessProfileDto) {
    return this.businessProfileService.create(createBusinessProfileDto);
  }

  @Get()
  @Public()
  findAll(@Req() req: Request) {
    return this.businessProfileService.findAll(req.query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessProfileService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBusinessProfileDto: UpdateBusinessProfileDto) {
    return this.businessProfileService.update(id, updateBusinessProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessProfileService.remove(id);
  }
}
