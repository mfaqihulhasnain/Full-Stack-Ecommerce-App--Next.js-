import { Container } from "@/components/ui/container";
import { Truck, ShieldCheck, HeadphonesIcon, Award, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const metadata = {
  title: "About Us - NovaBuy",
  description: "Learn more about NovaBuy, our mission, values and the team behind our success.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <Image 
          src="/images/clothing-category.jpg" 
          alt="About NovaBuy" 
          fill
          priority
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
        
        <div className="absolute inset-0 flex items-center">
          <Container>
            <div className="max-w-2xl text-white">
              <div className="inline-block bg-primary/90 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-4">
                Est. 2022
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Our Story, <span className="bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">Our Mission</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6 max-w-xl">
                We're on a mission to revolutionize online shopping by combining quality products with exceptional customer experience.
              </p>
            </div>
          </Container>
        </div>
      </section>
      
      {/* Mission & Values Section */}
      <section className="py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-center">Our Mission</h2>
                <p className="max-w-3xl mx-auto text-lg text-center text-gray-600 leading-relaxed">
                  At NovaBuy, we're committed to providing high-quality products at competitive prices
                  with exceptional customer service. Our mission is to create a shopping experience
                  that is both enjoyable and convenient for our customers.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Quality</h3>
                  <p className="text-gray-600">
                    Every product in our inventory is carefully selected and verified to ensure 
                    it meets our high standards for quality and value.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Transparency</h3>
                  <p className="text-gray-600">
                    We maintain transparency in all our operations, from honest product descriptions 
                    to clear pricing and shipping policies.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                  <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center mb-4">
                    <HeadphonesIcon className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Customer Focus</h3>
                  <p className="text-gray-600">
                    Our customers are at the heart of everything we do. We continuously improve our 
                    platform based on your feedback and needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      
      {/* Our Journey Timeline */}
      <section className="py-12 bg-gray-50">
        <Container>
          <h2 className="text-3xl font-bold mb-12 text-center">Our Journey</h2>
          
          <div className="max-w-4xl mx-auto relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>
            
            {/* Timeline items */}
            <div className="flex flex-col gap-12">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0 md:text-right">
                  <h3 className="text-xl font-bold text-primary">2022</h3>
                  <h4 className="text-lg font-semibold mb-2">Founded in Passion</h4>
                  <p className="text-gray-600">NovaBuy was established with a vision to create a shopping platform that truly puts customers first.</p>
                </div>
                <div className="rounded-full w-10 h-10 bg-primary flex items-center justify-center z-10">
                  <div className="rounded-full w-6 h-6 bg-white"></div>
                </div>
                <div className="md:w-1/2 md:pl-8"></div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-8"></div>
                <div className="rounded-full w-10 h-10 bg-primary flex items-center justify-center z-10">
                  <div className="rounded-full w-6 h-6 bg-white"></div>
                </div>
                <div className="md:w-1/2 md:pl-8 mb-6 md:mb-0 md:text-left">
                  <h3 className="text-xl font-bold text-primary">2023</h3>
                  <h4 className="text-lg font-semibold mb-2">Expanded Selection</h4>
                  <p className="text-gray-600">We grew our product catalog to include a wider range of carefully selected items from trusted suppliers.</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0 md:text-right">
                  <h3 className="text-xl font-bold text-primary">2024</h3>
                  <h4 className="text-lg font-semibold mb-2">Enhanced Experience</h4>
                  <p className="text-gray-600">We redesigned our platform to provide a more intuitive and enjoyable shopping experience for our customers.</p>
                </div>
                <div className="rounded-full w-10 h-10 bg-primary flex items-center justify-center z-10">
                  <div className="rounded-full w-6 h-6 bg-white"></div>
                </div>
                <div className="md:w-1/2 md:pl-8"></div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-8"></div>
                <div className="rounded-full w-10 h-10 bg-primary flex items-center justify-center z-10">
                  <div className="rounded-full w-6 h-6 bg-white"></div>
                </div>
                <div className="md:w-1/2 md:pl-8 mb-6 md:mb-0 md:text-left">
                  <h3 className="text-xl font-bold text-primary">Today</h3>
                  <h4 className="text-lg font-semibold mb-2">Continuous Growth</h4>
                  <p className="text-gray-600">We continue to grow and innovate, always focused on improving your shopping experience with us.</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      
      {/* Team Section */}
      <section className="py-12">
        <Container>
          <h2 className="text-3xl font-bold mb-4 text-center">Meet Our Team</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Behind every great product is a passionate team dedicated to providing the best shopping experience possible.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Founder & CEO",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
                bio: "With over 10 years in retail, Sarah leads our vision and strategy."
              },
              {
                name: "David Chen",
                role: "Head of Product",
                image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
                bio: "David ensures that every product we offer meets our quality standards."
              },
              {
                name: "Maya Patel",
                role: "Customer Experience",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
                bio: "Maya is dedicated to making your shopping experience exceptional."
              },
              {
                name: "James Wilson",
                role: "Tech Lead",
                image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
                bio: "James keeps our platform running smoothly and securely."
              }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md group">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
      
      {/* Testimonials */}
      <section className="py-12 bg-gray-50">
        <Container>
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Emma S.",
                location: "Seattle, WA",
                text: "NovaBuy has completely changed how I shop online. Their product quality is exceptional and delivery is always on time!",
                rating: 5
              },
              {
                name: "Michael T.",
                location: "Chicago, IL",
                text: "I appreciate the transparency in their pricing and shipping policies. No hidden fees or surprises when checking out.",
                rating: 5
              },
              {
                name: "Olivia P.",
                location: "Austin, TX",
                text: "Their customer service is top-notch. I had an issue with my order and they resolved it immediately. Highly recommend!",
                rating: 4
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
      
      {/* CTA Section */}
      <section className="py-12">
        <Container>
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl overflow-hidden">
            <div className="px-8 py-12 md:p-12 text-white max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Shopping?</h2>
              <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of satisfied customers and discover why NovaBuy is the preferred choice for online shopping.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/shop">
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                    Start Shopping
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" className="border-2 border-white bg-transparent hover:bg-white/10">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}