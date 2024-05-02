import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const requester = supertest.agent('http://localhost:8080')

describe('Testing Ecommerce', () => {
  describe('Testing Session', () => {
    it('Debe registrar correctamente un usuario', async () => {
      const mockUser = {
        first_name: 'Elmerindio',
        last_name: 'Caderoso',
        email: 'elmercaderoso@gmail.com',
        age: 22,
        password: '123456',
        role: 'premium'
      }
      const { ok, statusCode } = await requester
        .post('/api/session/register')
        .send(mockUser)
      expect(ok).to.be.ok
      expect(statusCode).to.equal(201)
    })
    it('No debe registrar un usuario existente', async () => {
      const mockUser = {
        first_name: 'Elmerindio',
        last_name: 'Caderoso',
        email: 'elmercaderoso@gmail.com',
        age: 22,
        password: '123456'
      }
      const { ok, statusCode } = await requester
        .post('/api/session/register')
        .send(mockUser)
      expect(ok).to.be.equal(false)
      expect(statusCode).to.equal(302)
    })

  it('Debe loguear correctamente al usuario', async () => {
    const mockUser = {
      email: 'elmercaderoso@gmail.com',
      password: '123456',
    }
    await requester
      .post('/api/session/login')
      .send(mockUser)
      .expect(302)
      .expect('Location', '/')
  })
  
    it('Debe enviar la info de la session que contiene el usuario y desestructurarla correctamente', async () => {
      const { _body } = await requester.get('/api/session/current')
      expect(_body.first_name).to.be.equal('Elmerindio')
      expect(_body.email).to.be.equal('elmercaderoso@gmail.com')
    })
  })
  describe('Testing Products', () => {
    it('Debe dar de alta correctamente un producto', async () => {
      const productMock = {
        title: 'Mock Product',
        price: 122.5,
        description: 'Mocking Products',
        code: 'AAAA 3333 FFFF',
        stock: 14,
        status: true,
        category: 'Mocks',
        owner: 'prueba@prueba.com',
      }

      const {statusCode, _body} = await requester.post('/api/products').send(productMock)
        expect(statusCode).to.be.eql(200);
        expect(_body.payload).to.have.property('_id');
    })
    it('No debe permitir dar de alta un producto sin campos requeridos, ej. title', async () => {
    const productMock = {
        price: 122.5,
        description: 'Mocking Products',
        code: 'AAAA 3333 FFFF 2222',
        stock: 14,
        status: true,
        category: 'Mocks',
        owner: 'prueba@prueba.com',
      }

      const {statusCode} = await requester.post('/api/products').send(productMock)
        expect(statusCode).to.be.eql(400);
       
    })
    it('Devuelve todos los productos dados de alta', async () => {
      const { _body,statusCode } = await requester.get('/api/products')
      expect(_body.payload).to.be.an('array')
      expect(statusCode).to.be.eql(200)

    })
    it('Devuelve todos los productos de una categoría en particular', async()=> {
        const { _body,statusCode } = await requester.get('/api/products?query=category:computers')
        expect(_body.payload).to.be.an('array')
        expect(statusCode).to.be.eql(200)
    })
  }) 
  describe('Testing Cart', () => {
    it('Agregamos un producto en un carrito', async()=> {
        const productMock = {
        title: 'Mock Product 2',
        price: 122.5,
        description: 'Mocking Products',
        code: 'AAAA 3333 FFFF 2222',
        stock: 14,
        status: true,
        category: 'Mocks',
        owner: 'prueba@prueba.com',
      }

      const { _body } = await requester.post('/api/products').send(productMock)
      const current = await requester.get('/api/session/current')     
      const {statusCode} = await requester.post(`/api/carts/${current._body.cartId}/product/${_body.payload._id}`)
      expect(statusCode).to.be.equal(302)  
    })
    it('Comprobamos que el carrito tiene el producto agregado', async function () {
      const current = await requester.get('/api/session/current')
      const cart = await requester.get(`/api/carts/${current._body.cartId}`)
      expect(cart._body.cart.products[0].product.title).to.equal(
        'Mock Product 2'
      )
    })
    it("Se elimina un producto del carrito", async function(){
        const current = await requester.get('/api/session/current')
        const cart = await requester.get(`/api/carts/${current._body.cartId}`)
        let response = await requester.delete(`/api/carts/${current._body.cartId}/product/${cart._body.cart.products[0].product._id}`)
        expect(response.status).to.be.equal(200)
    })
  })
})
