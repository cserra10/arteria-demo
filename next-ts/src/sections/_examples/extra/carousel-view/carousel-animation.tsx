import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { varAlpha, bgGradient } from 'src/theme/styles';

import { Image } from 'src/components/image';
import { varFade, MotionContainer } from 'src/components/animate';
import { Carousel, useCarousel, CarouselArrowNumberButtons } from 'src/components/carousel';

import { IndexLabel } from './elements';

// ----------------------------------------------------------------------

type Props = {
  data: {
    id: string;
    title: string;
    coverUrl: string;
    description: string;
  }[];
};

export function CarouselAnimation({ data }: Props) {
  const carousel = useCarousel();

  return (
    <Box sx={{ position: 'relative' }}>
      <Carousel carousel={carousel} sx={{ borderRadius: 2 }}>
        {data.map((item, index) => (
          <CarouselItem
            key={item.id}
            index={index}
            item={item}
            selected={index === carousel.dots.selectedIndex}
          />
        ))}
      </Carousel>

      <CarouselArrowNumberButtons
        {...carousel.arrows}
        options={carousel.options}
        totalSlides={carousel.dots.dotCount}
        selectedIndex={carousel.dots.selectedIndex + 1}
        sx={{ top: 16, right: 16, position: 'absolute' }}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

type CarouselItemProps = {
  index: number;
  selected: boolean;
  item: Props['data'][number];
};

function CarouselItem({ item, index, selected }: CarouselItemProps) {
  const theme = useTheme();

  return (
    <Box sx={{ position: 'relative' }}>
      <IndexLabel index={index + 1} />

      <Image
        visibleByDefault
        alt={item.title}
        src={item.coverUrl}
        ratio={{ xs: '4/3', sm: '16/10' }}
      />

      <Box
        sx={{
          ...bgGradient({
            color: `to top, ${theme.vars.palette.grey[900]}, ${varAlpha(theme.vars.palette.grey['900Channel'], 0)}`,
          }),
          top: 0,
          width: 1,
          height: 1,
          position: 'absolute',
        }}
      />

      <Box
        component={MotionContainer}
        animate={selected}
        action
        sx={{
          p: 3,
          left: 0,
          width: 1,
          bottom: 0,
          position: 'absolute',
          color: 'common.white',
        }}
      >
        <m.div variants={varFade().inRight}>
          <Typography
            noWrap
            sx={{
              mb: 1,
              typography: { xs: 'subtitle1', md: 'h3' },
            }}
          >
            {item.title}
          </Typography>
        </m.div>

        <m.div variants={varFade().inRight}>
          <Typography noWrap variant="body2">
            {item.description}
          </Typography>
        </m.div>

        <m.div variants={varFade().inRight}>
          <Button
            color="primary"
            variant="contained"
            sx={{ mt: 3, display: { xs: 'none', sm: 'inline-flex' } }}
          >
            View More
          </Button>
        </m.div>
      </Box>
    </Box>
  );
}
