import { Test, TestingModule } from "@nestjs/testing"
import { BookService } from "./book.service"
import { getModelToken } from "@nestjs/mongoose"
import { Book, Category } from "./schemas/book.schema"
import mongoose, { Model } from "mongoose"
import { BadRequestException, NotFoundException } from "@nestjs/common"

describe('BookService', () => {
    let bookService: BookService;
    let model: Model<Book>;

    const mockBook = {
        _id: '61c0ccf11d7bf83d153d7c06',
        user: '61c0ccf11d7bf83d153d7c06',
        title: 'New Book',
        description: 'Book Description',
        author: 'Author',
        price: 100,
        category: Category.FANTASY,
    };

    const mockBookService = {
        findById: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookService,
                {
                    provide: getModelToken(Book.name),
                    useValue: mockBookService
                }
            ]
        }).compile()

        bookService = module.get<BookService>(BookService)
        model = module.get<Model<Book>>(getModelToken(Book.name))
    });

    describe('findById', () => {

        it('should find and return a book by ID', async () => {
            jest.spyOn(model, 'findById').mockResolvedValue(mockBook)

            const result = await bookService.findById(mockBook._id)

            expect(model.findById).toHaveBeenLastCalledWith(mockBook._id)
            expect(result).toEqual(mockBook)
        })

        it('should throw BadRequestException if invalid ID is provided', async () => {
            const id = 'invalid-id';
            const isValidObjectIDMock = jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);
            const result = bookService.findById(id)

            await expect(result).rejects.toThrow(BadRequestException);
            expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
            isValidObjectIDMock.mockRestore();
        });

        it('should throw NotFoundException if book is not found', async () => {
            jest.spyOn(model, 'findById').mockResolvedValue(null)
            
            const result = bookService.findById(mockBook._id)
            
            await expect(result).rejects.toThrow(NotFoundException);
            expect(model.findById).toHaveBeenLastCalledWith(mockBook._id)
        })
    })
})