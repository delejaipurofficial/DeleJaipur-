import { Quote } from 'lucide-react';

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="card-static p-8 relative overflow-hidden">
      {/* Big quote mark */}
      <Quote className="absolute top-4 right-4 w-10 h-10 text-primary-light opacity-50" />

      <p className="text-onSurface leading-relaxed mb-6 relative z-10">
        "{testimonial.quote}"
      </p>

      <div className="flex items-center gap-4">
        {testimonial.imageURL ? (
          <img
            src={testimonial.imageURL}
            alt={testimonial.studentName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-light"
          />
        ) : (
          <div className="w-12 h-12 rounded-full hero-gradient flex items-center justify-center text-white font-bold text-lg">
            {testimonial.studentName?.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-display font-bold text-onSurface">{testimonial.studentName}</p>
          <p className="text-sm text-onSurfaceVariant">{testimonial.country} | {testimonial.track}</p>
        </div>
      </div>
    </div>
  );
}
