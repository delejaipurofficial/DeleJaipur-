import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';

const levelColors = {
  Beginner: 'bg-green-50 text-green-700',
  Intermediate: 'bg-blue-50 text-blue-700',
  Advanced: 'bg-purple-50 text-purple-700',
  'All Levels': 'bg-amber-50 text-amber-700',
};

export default function CourseCard({ course, id }) {
  const levelClass = levelColors[course.level] || 'bg-surface-high text-secondary';

  return (
    <div className="card group overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl bg-surface-high">
        {course.imageURL ? (
          <img
            src={course.imageURL}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full hero-gradient flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-white/60" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`label-sm text-[10px] px-2.5 py-1 rounded-full font-semibold ${levelClass}`}>
            {course.level}
          </span>
        </div>
        {course.status === 'active' && (
          <div className="absolute top-3 right-3">
            <span className="badge-active text-[10px]">Live</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="headline-md text-lg mb-2 text-onSurface group-hover:text-primary-container transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-onSurfaceVariant line-clamp-2 mb-4 flex-1">
          {course.description}
        </p>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-high">
          <div>
            <span className="label-sm text-onSurfaceVariant text-[10px]">Starting at</span>
            <p className="font-display font-extrabold text-xl text-onSurface">
              ₹{course.price?.toLocaleString('en-IN') || '—'}
            </p>
          </div>
          <Link
            to={`/courses/${id}`}
            className="btn-primary text-sm py-2 px-4"
          >
            Details
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
