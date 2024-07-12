import Link from 'next/link'
import {
  FaBox,
  FaChartLine,
  FaEnvelope,
  FaFacebook,
  FaGlobe,
  FaIndustry,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaPlane,
  FaShoppingCart,
  FaTiktok,
  FaTruck,
  FaTwitter,
  FaUsers,
  FaYoutube
} from 'react-icons/fa'
import ReactShowMoreText from 'react-show-more-text'

import { Badge } from '@a/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@a/ui/card'

import type { CompanyInfo } from '~/types'

const ICON_SOCIAL = {
    facebook: <FaFacebook />,
    instagram: <FaInstagram />,
    linkedin: <FaLinkedin />,
    tiktok: <FaTiktok />,
    twitter: <FaTwitter />,
    youtube: <FaYoutube />
  } as Record<string, JSX.Element>,
  More = ({ more }: { readonly more: CompanyInfo }) => {
    const {
      buyingProducts,
      companyDescription,
      emails,
      importPotential,
      importPotentialReasoning,
      industries,
      internationalTrade,
      phones,
      sellingProducts,
      socialMedia,
      storesBranchesOffices,
      targetCustomers,
      targetSuppliers
    } = more

    return (
      <div className='space-y-3 px-3 py-1'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <FaGlobe className='mr-2 text-xl sm:text-lg' />
              Company Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-stone-600'>{companyDescription}</p>
          </CardContent>
        </Card>

        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          <Card className='md:col-span-1'>
            <CardHeader>
              <CardTitle className='flex items-center text-base sm:text-lg'>
                <FaChartLine className='mr-2 text-2xl sm:text-xl' />
                Import Potential
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-lg font-bold'>{importPotential}/10</p>
              <p className='mt-2 text-sm text-stone-600'>{importPotentialReasoning}</p>
            </CardContent>
          </Card>

          <div className='space-y-4 md:col-span-1'>
            {industries && industries.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center text-base'>
                    <FaIndustry className='text-l mr-2 sm:text-xl' />
                    Fields
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-wrap gap-2'>
                    {industries.map((industry, index) => (
                      <Badge key={index} variant='secondary'>
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {internationalTrade && internationalTrade.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center text-base'>
                    <FaPlane className='text-l mr-2 sm:text-xl' />
                    International Trade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-wrap gap-2'>
                    {internationalTrade.map((country, index) => (
                      <Badge key={index} variant='secondary'>
                        {country}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>

        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          {targetCustomers && targetCustomers.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center text-base'>
                  <FaUsers className='mr-2 text-xl sm:text-lg' />
                  Target Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='list-disc space-y-1 pl-5'>
                  {targetCustomers.map((customer, index) => (
                    <li className='text-sm' key={index}>
                      {customer}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          {targetSuppliers && targetSuppliers.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center text-base'>
                  <FaTruck className='mr-2 text-xl sm:text-lg' />
                  Target Suppliers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='list-disc space-y-1 pl-5'>
                  {targetSuppliers.map((supplier, index) => (
                    <li className='text-sm' key={index}>
                      {supplier}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
        </div>

        {sellingProducts && sellingProducts.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center text-base'>
                <FaShoppingCart className='mr-2 text-xl sm:text-lg' />
                Selling Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2'>
                {sellingProducts.map((product, index) => (
                  <li className='border-b border-stone-300 pb-2 last:border-b-0' key={index}>
                    <p className='notranslate text-base font-medium'>{product.name}</p>
                    <ReactShowMoreText
                      className='text-xs text-muted-foreground'
                      keepNewLines={false}
                      lines={2}>
                      {product.description}
                    </ReactShowMoreText>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}

        {buyingProducts && buyingProducts.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center text-base'>
                <FaBox className='mr-2 text-xl sm:text-lg' />
                Potential Buying / Imports Goods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='list-disc space-y-1 pl-5'>
                {buyingProducts.map((product, index) => (
                  <li className='text-sm' key={index}>
                    {product}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}

        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          {storesBranchesOffices && storesBranchesOffices.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center text-base'>
                  <FaMapMarkerAlt className='mr-2 text-xl sm:text-lg' />
                  Offices
                </CardTitle>
              </CardHeader>
              <CardContent className='notranslate'>
                <ul className='space-y-2'>
                  {storesBranchesOffices.map((location, index) => (
                    <li className='flex items-center text-sm' key={index}>
                      <FaMapMarkerAlt className='mr-2 size-4' />
                      {location.name} - {location.country}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center text-base'>
                <FaEnvelope className='mr-2 text-xl sm:text-lg' />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className='notranslate'>
              <div className='space-y-2 text-sm'>
                {emails?.map((email, index) => (
                  <p className='flex items-center' key={index}>
                    <FaEnvelope className='mr-2 size-4' />
                    {email}
                  </p>
                ))}
                {phones?.map((phone, index) => (
                  <p className='flex items-center' key={index}>
                    <FaPhone className='mr-2 size-4' />
                    {phone}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {socialMedia && socialMedia.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center text-lg'>
                <FaGlobe className='mr-2 text-xl sm:text-lg' />
                Social Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                {socialMedia.map((social, index) => (
                  <Link
                    className='flex items-center text-blue-600 hover:underline'
                    href={social.url}
                    key={index}
                    rel='noreferrer'
                    target='_blank'>
                    <Badge className='flex items-center gap-1' variant='outline'>
                      {ICON_SOCIAL[social.platform.toLowerCase()] ?? <FaGlobe />}
                      {social.platform}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    )
  }

export default More
