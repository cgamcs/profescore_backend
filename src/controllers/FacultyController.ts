import colors from 'colors';
import type { Request, Response } from 'express'
import Faculty, { IFaculty } from '../models/Faculty'

declare module 'express' {
    interface Request {
        faculty?: IFaculty;
    }
}

export class FacultyController {
    static createFaculty = async (req: Request, res: Response) => {
        const faculty = new Faculty(req.body)

        try {
            await faculty.save()
            res.send('Facultad agregada correctamente')
        } catch (error) {
            console.log( colors.red.bold(`Error al agregar facultad - ${error.message}`) )
        }
    }

    static getAllFacultys = async (req: Request, res: Response) => {
        try {
            const facultys = await Faculty.find({})
            res.json(facultys)
        } catch (error) {
            console.log( colors.red.bold(`Error al mostrar las facultades - ${error.message}`) )
        }
    }

    static getFacultyById = async (req: Request, res: Response) => {
        try {
            res.json(req.faculty)
        } catch (error) {
            console.log( colors.red.bold(`Error al mostrar facultad - ${error.message}`) )
        }
    }

    static updateFaculty = async (req: Request, res: Response) => {
        try {
            req.faculty.name = req.body.name
            req.faculty.abbreviation = req.body.abbreviation

            await req.faculty.save()
            res.send('Facultad actualizada')
        } catch (error) {
            console.log( colors.red.bold(`Error al mostrar facultad - ${error.message}`) )
        }
    }

    static deleteFaculty = async (req: Request, res: Response) => {
        try {
            await req.faculty.deleteOne()
            res.send('Facultad eliminada')
        } catch (error) {
            console.log( colors.red.bold(`Error al mostrar facultad - ${error.message}`) )
        }
    }
}