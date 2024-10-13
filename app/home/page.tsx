"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Menu, User, Package, LogOut } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { auth, db } from '../../firebase'
import { collection, getDocs } from "firebase/firestore"
import { signOut } from "firebase/auth"
import { useRouter } from 'next/navigation'

interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface CartItem extends Item {
  quantity: number;
}

export default function BusinessWebsite() {
  const [items, setItems] = useState<Item[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchItems = async () => {
      const itemsCollection = collection(db, 'items')
      const itemsSnapshot = await getDocs(itemsCollection)
      const itemsList = itemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Item))
      setItems(itemsList)
    }

    fetchItems()
  }, [])

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const filteredItems = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setItems(filteredItems)
  }

  const addToCart = (item: Item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      } else {
        return [...prevCart, { ...item, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Failed to log out', error)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-4">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="space-y-4 mt-4">
                <Link href="#" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                  <User size={20} />
                  <span>Profile</span>
                </Link>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start">
                      <ShoppingCart size={20} className="mr-2" />
                      <span>Cart ({cart.length})</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Your Cart</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center mb-2">
                          <span>{item.name} (x{item.quantity})</span>
                          <div>
                            <span className="mr-2">${(item.price * item.quantity).toFixed(2)}</span>
                            <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.id)}>Remove</Button>
                          </div>
                        </div>
                      ))}
                      <div className="mt-4 font-bold">Total: ${getTotalPrice()}</div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Link href="#" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                  <Package size={20} />
                  <span>Orders</span>
                </Link>
                <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut size={20} className="mr-2" />
                  <span>Logout</span>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
          <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4">
            <Input
              type="search"
              placeholder="Search items..."
              className="w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Featured Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={`/placeholder.svg?height=200&width=300`}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
                  <Button onClick={() => addToCart(item)}>Add to Cart</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}